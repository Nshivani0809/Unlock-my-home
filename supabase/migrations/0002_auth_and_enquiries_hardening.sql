-- Unlock My Home: safer account onboarding, direct enquiries and site visits.
-- Apply AFTER 0001_initial_schema.sql in Supabase SQL Editor.

-- Every new signup starts with the least-privileged role (buyer).
-- The selected account_type is only a request; admin approval grants seller/dealer permissions.
alter table public.profiles
  add column if not exists seller_status text not null default 'not_applicable'
    check (seller_status in ('not_applicable','pending','approved','suspended')),
  add column if not exists city text,
  add column if not exists business_name text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_type text;
begin
  requested_type := case
    when new.raw_user_meta_data->>'account_type' in ('buyer','owner','dealer')
      then new.raw_user_meta_data->>'account_type'
    else 'buyer'
  end;

  insert into public.profiles
    (id, full_name, phone, role, account_type, dealer_status, seller_status)
  values
    (new.id,
     coalesce(nullif(trim(new.raw_user_meta_data->>'full_name'), ''), 'New user'),
     nullif(trim(new.raw_user_meta_data->>'phone'), ''),
     'buyer'::public.app_role,
     requested_type,
     case when requested_type = 'dealer' then 'pending' else 'not_applicable' end,
     case when requested_type = 'owner' then 'pending' else 'not_applicable' end)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Do not allow a public signup or profile update to self-assign privileged roles/status.
create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() = old.id and not public.is_admin() then
    if new.role is distinct from old.role
       or new.dealer_status is distinct from old.dealer_status
       or new.seller_status is distinct from old.seller_status
       or new.account_type is distinct from old.account_type then
      raise exception 'Account role and approval status can only be changed by an administrator.';
    end if;
  end if;
  return new;
end;
$$;

-- Direct enquiries are allowed without an account, but must reference a live, approved listing.
drop policy if exists "buyer can create enquiry" on public.enquiries;
create policy "public can enquire on published properties" on public.enquiries
for insert to anon, authenticated
with check (
  (buyer_id is null or buyer_id = auth.uid())
  and exists (
    select 1 from public.properties p
    where p.id = property_id
      and p.listing_status = 'published'
      and p.admin_verified = true
  )
);

-- Separate, structured site-visit requests. buyer_id remains nullable for guest visitors.
create table if not exists public.site_visits (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  buyer_id uuid references public.profiles(id) on delete set null,
  visitor_name text not null check (char_length(visitor_name) between 2 and 120),
  visitor_email text not null,
  visitor_phone text not null,
  preferred_date date,
  preferred_time text,
  message text,
  status text not null default 'new'
    check (status in ('new','confirmed','rescheduled','completed','cancelled')),
  assigned_to uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_visit_email_format check (position('@' in visitor_email) > 1)
);
create index if not exists site_visits_property_idx on public.site_visits(property_id, created_at desc);
create index if not exists site_visits_assigned_idx on public.site_visits(assigned_to, preferred_date);
alter table public.site_visits enable row level security;
create policy "public can request visit for published property" on public.site_visits
for insert to anon, authenticated
with check (
  (buyer_id is null or buyer_id = auth.uid())
  and exists (
    select 1 from public.properties p
    where p.id = property_id and p.listing_status = 'published' and p.admin_verified = true
  )
);
create policy "visitor sees own visit requests" on public.site_visits
for select to authenticated
using (buyer_id = auth.uid() or assigned_to = auth.uid() or public.is_admin());
create policy "assigned team or admin updates visit" on public.site_visits
for update to authenticated
using (assigned_to = auth.uid() or public.is_admin())
with check (assigned_to = auth.uid() or public.is_admin());

-- Contact Us messages are separate from property enquiries.
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null check (char_length(sender_name) between 2 and 120),
  sender_phone text,
  sender_email text not null,
  enquiry_purpose text not null check (enquiry_purpose in ('buy','sell','invest','other')),
  message text not null check (char_length(message) between 10 and 3000),
  consent_to_contact boolean not null default false check (consent_to_contact = true),
  status text not null default 'new' check (status in ('new','contacted','closed','spam')),
  created_at timestamptz not null default now(),
  constraint contact_email_format check (position('@' in sender_email) > 1)
);
alter table public.contact_messages enable row level security;
create policy "public can send contact message" on public.contact_messages
for insert to anon, authenticated with check (true);
create policy "admin reads contact messages" on public.contact_messages
for select to authenticated using (public.is_admin());
create policy "admin manages contact messages" on public.contact_messages
for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Ensure guest enquiries cannot be read by arbitrary visitors; only authenticated participants/admins.
-- Existing enquiry select policy from migration 0001 is retained.

-- Helpful index for admin review queues.
create index if not exists profiles_review_queue_idx
  on public.profiles(account_type, seller_status, dealer_status, created_at desc);
