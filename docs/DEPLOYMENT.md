# Deployment quick guide

## Vercel + Supabase
1. Push this folder to a private GitHub repository.
2. Import the repository into Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL` in Vercel environment variables.
4. Deploy a preview and test.
5. Add your purchased domain in Vercel → Project → Settings → Domains.
6. Update DNS records at your domain registrar exactly as Vercel instructs.
7. Confirm HTTPS, canonical URL, Auth redirect URLs and email sender configuration.

## Existing cPanel hosting
A typical shared cPanel plan may only support PHP/static hosting. Do not assume it supports Next.js. Keep the domain with your current provider and deploy the Next.js app to a Node-compatible host, then point DNS to that host.

Never send passwords, API secrets or service-role keys over WhatsApp/email. Share repository access privately; keep `.env.local` out of Git.
