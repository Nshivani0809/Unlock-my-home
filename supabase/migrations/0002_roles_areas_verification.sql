-- Unlock My Home: production role and operations expansion.
-- Apply after 0001_initial_schema.sql. Review the security checklist before launch.

alter type public.app_role add value if not exists 'builder';
alter type public.app_role add value if not exists 'agent';
alter type public.app_role add value if not exists 'area_manager';

alter type public.property_type add value if not exists 'commercial_space';

alter table public.profiles
  add column if not exists business_name text,
  add column if not exists seller_kind text check (seller_kind is null or seller_kind in ('individual','builder','agent','dealer')),
  add column if not exists phone_verified_at timestamptz,
  add column if not exists onboarding_status text not null default 'incomplete'
    check (onboarding_status in ('incomplete','submitted','under_review','approved','rejected')),
  add column if not exists account_area text;

alter table public.properties
  add column if not exists builder_name text,
  add column if not exists property_subtype text,
  add column if not exists bedrooms smallint check (bedrooms is null or bedrooms between 0 and 20),
  add column if not exists bathrooms smallint check (bathrooms is null or bathrooms between 0 and 20),
  add column if not exists built_year smallint check (built_year is null or built_year between 1800 and 2200),
  add column if not exists area_sq_ft numeric(12,2) check (area_sq_ft is null or area_sq_ft > 0),
  add column if not exists gated_community boolean,
  add column if not exists security_details text,
  add column if not exists amenities text[] not null default '{}',
  add column if not exists floor_plan_path text,
  add column if not exists rera_number text,
  add column if not exists builder_project_name text,
  add column if not exists price_negotiable boolean not null default false;

create table if not exists public.service_areas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null default 'Hyderabad',
  state text not null default 'Telangana',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (name, city, state)
);

create table if not exists public.profile_area_access (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  area_id uuid not null references public.service_areas(id) on delete cascade,
  can_manage_listings boolean not null default true,
  can_manage_enquiries boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (profile_id, area_id)
);

alter table public.properties
  add column if not exists service_area_id uuid references public.service_areas(id) on delete set null;

create index if not exists properties_area_status_idx
  on public.properties(service_area_id, listing_status);

create table if not exists public.seller_verifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  verification_type text not null check (verification_type in ('identity','ownership_authority','business','rera')),
  document_path text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','needs_information')),
  reviewer_id uuid references public.profiles(id),
  reviewer_note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists seller_verifications_profile_idx
  on public.seller_verifications(profile_id, created_at desc);

create table if not exists public.site_visits (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  buyer_id uuid references public.profiles(id) on delete set null,
  buyer_name text not null,
  buyer_email text not null,
  buyer_phone text not null,
  preferred_at timestamptz,
  message text,
  status text not null default 'requested'
    check (status in ('requested','confirmed','completed','cancelled')),
  assigned_to uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
create index if not exists site_visits_property_idx on public.site_visits(property_id, created_at desc);

create table if not exists public.trusted_builders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_path text,
  website_url text,
  description text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.seller_verifications enable row level security;
alter table public.site_visits enable row level security;
alter table public.service_areas enable row level security;
alter table public.profile_area_access enable row level security;
alter table public.trusted_builders enable row level security;

create or replace function public.has_area_access(target_area uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profile_area_access a
    where a.profile_id = auth.uid() and a.area_id = target_area
  )
$$;

create or replace function public.can_manage_property_area(target_area uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select public.is_admin() or (
    public.current_app_role() = 'area_manager'
    and public.has_area_access(target_area)
  )
$$;

drop policy if exists "dealer seller can create own property" on public.properties;
create policy "approved listing accounts can create own property"
on public.properties for insert to authenticated
with check (
  owner_id = auth.uid()
  and public.current_app_role() in ('seller','dealer','builder','agent')
  and (
    public.current_app_role() = 'seller'
    or exists (
      select 1 from public.profiles pr
      where pr.id = auth.uid()
        and pr.dealer_status = 'approved'
        and pr.onboarding_status = 'approved'
    )
  )
);

drop policy if exists "owner can update own unpublished property" on public.properties;
create policy "owner or assigned moderator can update property"
on public.properties for update to authenticated
using (
  (owner_id = auth.uid() and listing_status in ('draft','rejected'))
  or public.is_admin()
  or (service_area_id is not null and public.can_manage_property_area(service_area_id))
)
with check (
  public.is_admin()
  or (owner_id = auth.uid() and listing_status in ('draft','pending_review','rejected'))
  or (service_area_id is not null and public.can_manage_property_area(service_area_id))
);

drop policy if exists "buyer can create enquiry" on public.enquiries;
create policy "public can submit enquiry for published listing"
on public.enquiries for insert
with check (
  exists (
    select 1 from public.properties p
    where p.id = property_id and p.listing_status = 'published' and p.admin_verified = true
  )
  and (buyer_id is null or buyer_id = auth.uid())
);

drop policy if exists "buyer sees own enquiries dealer sees assigned" on public.enquiries;
drop policy if exists "buyer sees own enquiries dealer/admin sees assigned" on public.enquiries;
create policy "buyer or assigned team sees enquiry"
on public.enquiries for select to authenticated
using (
  buyer_id = auth.uid()
  or assigned_to = auth.uid()
  or public.is_admin()
  or exists (
    select 1 from public.properties p
    where p.id = property_id and p.service_area_id is not null
      and public.can_manage_property_area(p.service_area_id)
  )
);

create policy "seller sees own verification requests"
on public.seller_verifications for select to authenticated
using (profile_id = auth.uid() or public.is_admin());

create policy "seller submits own verification request"
on public.seller_verifications for insert to authenticated
with check (profile_id = auth.uid() and status = 'pending' and reviewer_id is null);

create policy "admin reviews seller verification"
on public.seller_verifications for update to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public can view active service areas"
on public.service_areas for select
using (is_active = true or public.is_admin());

create policy "admin manages service areas"
on public.service_areas for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "users see own area assignments"
on public.profile_area_access for select to authenticated
using (profile_id = auth.uid() or public.is_admin());

create policy "admin manages area assignments"
on public.profile_area_access for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "public can view active trusted builders"
on public.trusted_builders for select
using (is_active = true);

create policy "admin manages trusted builders"
on public.trusted_builders for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "public can request a site visit"
on public.site_visits for insert
with check (
  exists (
    select 1 from public.properties p
    where p.id = property_id and p.listing_status = 'published' and p.admin_verified = true
  )
  and (buyer_id is null or buyer_id = auth.uid())
);

create policy "buyer or assigned team reads site visits"
on public.site_visits for select to authenticated
using (
  buyer_id = auth.uid() or assigned_to = auth.uid() or public.is_admin()
  or exists (
    select 1 from public.properties p
    where p.id = property_id and p.owner_id = auth.uid()
  )
);

create policy "assigned team updates site visits"
on public.site_visits for update to authenticated
using (assigned_to = auth.uid() or public.is_admin())
with check (assigned_to = auth.uid() or public.is_admin());

-- Keep verification documents private. The existing property-private bucket is private.
-- Do not upload Aadhaar numbers or full identity numbers; collect only the minimum
-- evidence required, with restricted access and a documented retention/deletion policy.
create policy "seller uploads own verification files"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'property-private'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "seller reads own verification files"
on storage.objects for select to authenticated
using (
  bucket_id = 'property-private'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
);
