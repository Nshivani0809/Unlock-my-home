import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
export const metadata: Metadata = {
  title: "Unlock My Home | Premium Property Discovery",
  description: "Discover land and properties for sale in Hyderabad with Unlock My Home.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Navbar />{children}<footer className="footer" id="contact"><div className="container footer-inner"><div><div className="brand footer-brand"><span className="brand-mark">⌂</span><span>UNLOCK <b>MY HOME</b><small>PREMIUM PROPERTY DISCOVERY</small></span></div><p>Find a place. See its potential.</p></div><div className="footer-links"><a href="/properties">Explore properties</a><a href="/login?mode=dealer">Partner with us</a><a href="mailto:hello@unlockmyhome.in">Contact</a></div><small>© {new Date().getFullYear()} Unlock My Home. All rights reserved.</small></div></footer></body></html>;
}
