-- Unlock My Home initial schema.
-- Run in Supabase SQL Editor after creating a project.
create extension if not exists pgcrypto;

create type public.app_role as enum ('buyer', 'dealer', 'seller', 'admin');
create type public.listing_status as enum ('draft', 'pending_review', 'published', 'rejected', 'archived');
create type public.property_type as enum ('residential_plot', 'commercial_plot', 'industrial_land', 'agricultural_land', 'house', 'villa', 'apartment', 'commercial_building');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  role public.app_role not null default 'buyer',
  account_type text not null default 'buyer' check (account_type in ('buyer','owner','dealer')),
  dealer_status text not null default 'not_applicable' check (dealer_status in ('not_applicable','pending','approved','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id),
  title text not null check (char_length(title) between 10 and 120),
  slug text not null unique,
  description text not null check (char_length(description) between 30 and 5000),
  property_type public.property_type not null,
  listing_status public.listing_status not null default 'draft',
  country_code char(2) not null default 'IN',
  state text not null,
  city text not null,
  locality text not null,
  address_private text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  area_sq_yards numeric(12,2) not null check (area_sq_yards > 0),
  price_amount numeric(16,2) not null check (price_amount > 0),
  currency char(3) not null default 'INR',
  facing text,
  road_width_ft numeric(6,2),
  dimensions text,
  corner_plot boolean,
  survey_number text,
  approval_authority text,
  approval_number text,
  ownership_type text,
  documents_available boolean not null default false,
  admin_verified boolean not null default false,
  rejection_reason text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index properties_public_search_idx on public.properties (listing_status, city, locality, property_type);
create index properties_owner_idx on public.properties (owner_id);
create index properties_price_idx on public.properties (currency, price_amount);

create table public.property_media (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id),
  storage_path text not null,
  media_type text not null check (media_type in ('image','video','document')),
  is_public boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id),
  buyer_id uuid references public.profiles(id),
  buyer_name text not null,
  buyer_email text not null,
  buyer_phone text,
  message text not null check (char_length(message) between 10 and 3000),
  status text not null default 'new' check (status in ('new','contacted','visit_requested','closed','spam')),
  assigned_to uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
create index enquiries_property_idx on public.enquiries(property_id, created_at desc);
create index enquiries_assigned_idx on public.enquiries(assigned_to, created_at desc);

create table public.favourites (
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (buyer_id, property_id)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Profile bootstrap. Role is always buyer at signup; elevated roles must be assigned by trusted admin tooling.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- Never trust signup metadata to grant a privileged role.
  -- Every new account starts as buyer; an administrator promotes sellers/dealers after review.
  insert into public.profiles (id, full_name, phone, role, account_type, dealer_status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name','New user'),
    new.raw_user_meta_data->>'phone',
    'buyer'::public.app_role,
    case
      when new.raw_user_meta_data->>'account_type' in ('buyer','owner','dealer')
        then new.raw_user_meta_data->>'account_type'
      else 'buyer'
    end,
    case
      when new.raw_user_meta_data->>'account_type' in ('owner','dealer') then 'pending'
      else 'not_applicable'
    end
  )
  on conflict (id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Users may edit their contact details, but cannot grant themselves a privileged role or dealer approval.
create or replace function public.protect_profile_privileges()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() = old.id and not public.is_admin() then
    if new.role is distinct from old.role or new.dealer_status is distinct from old.dealer_status or new.account_type is distinct from old.account_type then
      raise exception 'Role and approval status can only be changed by an administrator.';
    end if;
  end if;
  return new;
end; $$;
create trigger protect_profile_privileges before update on public.profiles
for each row execute procedure public.protect_profile_privileges();

create or replace function public.current_app_role()
returns public.app_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_app_role() = 'admin', false)
$$;

alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.property_media enable row level security;
alter table public.enquiries enable row level security;
alter table public.favourites enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles read self or admin" on public.profiles for select to authenticated
using (id = auth.uid() or public.is_admin());
create policy "profiles update self or admin" on public.profiles for update to authenticated
using (id = auth.uid() or public.is_admin())
with check ((id = auth.uid() and role = (select p.role from public.profiles p where p.id = auth.uid())) or public.is_admin());

create policy "public can view published properties" on public.properties for select
using (listing_status = 'published' and admin_verified = true or owner_id = auth.uid() or public.is_admin());
create policy "dealer seller can create own property" on public.properties for insert to authenticated
with check (owner_id = auth.uid() and (public.current_app_role() = 'seller' or (public.current_app_role() = 'dealer' and exists (select 1 from public.profiles pr where pr.id = auth.uid() and pr.dealer_status = 'approved'))));
create policy "owner can update own unpublished property" on public.properties for update to authenticated
using ((owner_id = auth.uid() and listing_status in ('draft','rejected')) or public.is_admin())
with check ((owner_id = auth.uid() and listing_status in ('draft','pending_review','rejected')) or public.is_admin());
create policy "admin can delete property" on public.properties for delete to authenticated using (public.is_admin());

create policy "media read public or owner or admin" on public.property_media for select
using (is_public = true or uploaded_by = auth.uid() or public.is_admin());
create policy "dealer can add own media" on public.property_media for insert to authenticated
with check (uploaded_by = auth.uid() and exists (select 1 from public.properties p where p.id = property_id and p.owner_id = auth.uid()));
create policy "owner or admin can delete media" on public.property_media for delete to authenticated
using (uploaded_by = auth.uid() or public.is_admin());

create policy "buyer can create enquiry" on public.enquiries for insert
with check (true);
create policy "buyer sees own enquiries dealer/admin sees assigned" on public.enquiries for select to authenticated
using (buyer_id = auth.uid() or assigned_to = auth.uid() or public.is_admin());
create policy "dealer/admin can update assigned enquiry" on public.enquiries for update to authenticated
using (assigned_to = auth.uid() or public.is_admin())
with check (assigned_to = auth.uid() or public.is_admin());

create policy "buyer manages own favourites" on public.favourites for all to authenticated
using (buyer_id = auth.uid()) with check (buyer_id = auth.uid());
create policy "admin reads audit logs" on public.audit_logs for select to authenticated using (public.is_admin());
create policy "authenticated can write own audit event" on public.audit_logs for insert to authenticated with check (actor_id = auth.uid());

-- Storage buckets: property-public for approved photos; property-private for documents.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
('property-public','property-public',true,10485760,array['image/jpeg','image/png','image/webp']),
('property-private','property-private',false,20971520,array['application/pdf','image/jpeg','image/png'])
on conflict (id) do nothing;

create policy "public reads approved listing photos" on storage.objects for select
using (bucket_id = 'property-public');
create policy "dealer uploads own public media folder" on storage.objects for insert to authenticated
with check (bucket_id = 'property-public' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "dealer reads own private documents" on storage.objects for select to authenticated
using (bucket_id = 'property-private' and (storage.foldername(name))[1] = auth.uid()::text or public.is_admin());
create policy "dealer uploads own private documents" on storage.objects for insert to authenticated
with check (bucket_id = 'property-private' and (storage.foldername(name))[1] = auth.uid()::text);
