# Unlock My Home

Premium property discovery marketplace — initially focused on Hyderabad, designed so the product can expand to other Indian cities and international markets.

## Important project status

This repository is a **production-oriented starter**, not a fully launched production service. It includes:
- Responsive premium navy-and-champagne-gold website foundation.
- Public homepage and property catalogue with illustrative sample data.
- Buyer/dealer sign-in entry screen placeholder.
- Dealer and admin portal entry pages.
- Supabase client/server setup.
- Initial PostgreSQL schema and Row Level Security (RLS) policies.
- Storage buckets for public listing photos and private documents.
- Your previously supplied HTML reference pages in `reference-pages/`.

Before public launch, connect a Supabase project, implement and test complete authentication, listing CRUD, upload workflows, enquiry handling, admin moderation, email notifications, monitoring and backups. Never advertise the sample records as real properties.

## 1. Requirements

- Node.js 20.9 or newer
- npm
- A Supabase project
- A Vercel account for commercial hosting (or another supported Node.js host)

## 2. Run locally

1. Extract this ZIP.
2. Open the `unlock-my-home` folder in VS Code.
3. Open a terminal in that folder.
4. Run:

   ```bash
   npm install
   cp .env.example .env.local
   npm run dev
   ```

5. Open http://localhost:3000.

On Windows PowerShell, use `Copy-Item .env.example .env.local` instead of `cp`.

The public demo pages can be reviewed before connecting Supabase. Login is intentionally disabled until authentication is configured.

## 3. Configure Supabase

1. Create a project at https://supabase.com.
2. In Project Settings → API, copy the Project URL and anon/publishable key into `.env.local`.
3. In SQL Editor, run `supabase/migrations/0001_initial_schema.sql`.
4. Configure Auth providers and email templates.
5. Set the first trusted admin role manually through the Supabase SQL editor after creating that user's account:

   ```sql
   update public.profiles
   set role = 'admin'
   where id = 'AUTH_USER_UUID';
   ```

   Replace the UUID with the actual user ID from Authentication → Users. Do not expose service-role keys in browser code.
6. Configure storage policies and test them with buyer, dealer, seller and admin accounts before launch.

## 4. User access model

- Buyer: public browsing; sign up to save favourites and manage enquiries.
- Dealer: individually invited/approved account; can manage only their own listings.
- Seller: may apply to submit a property; seller access requires admin approval.
- Super Admin: created and elevated manually by the business owner; can moderate dealers and listings.

Never share one login between dealers. Use individual accounts and require MFA for admin accounts.

## 5. Property publishing workflow

1. Dealer creates a draft listing.
2. Dealer completes required fields and uploads photos.
3. Dealer submits it for review.
4. Admin checks ownership/authority documents and listing claims.
5. Admin approves and publishes the listing.
6. Dealer can request edits; material changes can return the listing to review.
7. Admin can unpublish a sold, withdrawn or misleading listing.

A platform badge must mean only what your documented verification process actually checks. Do not claim legal title is guaranteed unless qualified legal professionals have verified it.

## 6. Hosting and domain

Recommended deployment:
- Deploy the Next.js application to Vercel Pro for commercial use.
- Keep the database and storage in Supabase.
- Add your purchased domain in Vercel and apply the DNS records shown in its dashboard.
- Configure `NEXT_PUBLIC_SITE_URL` to your HTTPS domain.
- Add the same environment variables in Vercel Project Settings.
- Enable HTTPS and verify the domain before advertising.

If your existing hosting is cPanel/shared hosting, it may not run Next.js. You can still keep the domain there and point its DNS to the application host. Check your hosting plan before paying for another hosting subscription.

## 7. Production launch checklist

- [ ] Replace all sample/demo property data with real, authorised listings.
- [ ] Complete buyer, dealer, seller and admin authentication.
- [ ] Test RLS with separate accounts and confirm cross-dealer access is blocked.
- [ ] Build server-side property create/edit/submit/review flows.
- [ ] Validate and scan uploads; enforce file size/type limits.
- [ ] Keep identity/title/legal documents private; use signed URLs when access is authorised.
- [ ] Add CAPTCHA/rate limiting to public enquiry forms.
- [ ] Add email verification, password reset and admin MFA.
- [ ] Add privacy policy, terms, cookie notice and listing disclaimers reviewed for your markets.
- [ ] Confirm applicable RERA and local property advertising requirements with a qualified professional.
- [ ] Configure backup, restore test, monitoring and incident contact.
- [ ] Test mobile, accessibility, SEO metadata, sitemap and robots rules.
- [ ] Test production build with `npm run build`.
- [ ] Complete a security review before taking public enquiries or advertising.

## 8. Business choices already reflected

- Sale listings only — no rental inventory.
- Hyderabad first; location model supports expansion.
- Residential, commercial, industrial and agricultural land categories.
- Public buyers can browse without login.
- Dealers and sellers have individual, controlled access.
- Admin approval before a property is publicly published.
- Premium navy, champagne-gold and warm-neutral visual direction.

## 9. Suggested next development milestones

1. Supabase Auth and role onboarding.
2. Dealer listing CRUD and secure media uploads.
3. Admin verification and moderation queue.
4. Buyer enquiry, favourites and site-visit requests.
5. Search filters, maps and SEO landing pages.
6. Email/SMS notifications, analytics and paid featured listings.

## Disclaimer

This starter is not legal, financial, title-verification or regulatory advice. The business owner is responsible for validating listings, dealer authority, applicable laws, privacy practices and operational controls before launch.
