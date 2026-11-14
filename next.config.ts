import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Map Vercel's server-side environment variable names to the public
  // browser variables expected by the Supabase client. Only use the
  // Supabase project URL and publishable/legacy anon key here.
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.SUPABASE_URL ?? "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?? "",
  },
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
};

export default nextConfig;
