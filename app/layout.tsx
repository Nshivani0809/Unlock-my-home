import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Navbar from "@/components/Navbar";
export const metadata: Metadata = {
  title: "Unlock My Home — Discover · Compare · Visit · Own",
  description: "Discover verified properties, trusted builders and property opportunities in Hyderabad.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Navbar />{children}
    <footer className="footer" id="contact"><div className="wrap footer-inner">
      <div><Link className="brand" href="/" style={{marginBottom:10,color:"#fff"}}><span className="brand-mark" style={{color:"#E9B44C"}}>⌂</span><span>Unlock My Home<small>Discover · Compare · Visit · Own</small></span></Link><p>Your property journey, made clearer.</p></div>
      <div><h5>Quick Links</h5><Link href="/">Home</Link><Link href="/properties">Buy</Link><Link href="/properties?category=new-projects">New Projects</Link><Link href="/properties?category=resale">Resale</Link><Link href="/properties?type=Residential%20Plot">Plots</Link><Link href="/properties?type=Commercial%20Plot">Commercial</Link><Link href="/sell">Sell With Us</Link><Link href="/partner">Partner With Us</Link></div>
      <div><h5>Company</h5><Link href="/about">About Us</Link><Link href="/insights">Property Insights</Link><Link href="/calculator">EMI Calculator</Link><Link href="/contact">Contact Us</Link></div>
      <div><h5>Get in Touch</h5><a href="tel:8790158510">+91 8790158510</a><a href="https://wa.me/918790158510">WhatsApp us</a><a href="mailto:hello@unlockmyhome.in">hello@unlockmyhome.in</a><p>Hyderabad, Telangana</p></div>
      <div><h5>For Buyers & Sellers</h5><p>Browse property listings, enquire directly through the website or submit a property for review.</p><Link href="/register">Create an account →</Link></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Unlock My Home. All rights reserved. RERA details to be added where applicable.</span><span><Link href="/privacy">Privacy Policy</Link> · <Link href="/terms">Terms &amp; Conditions</Link></span></div>
    </div></footer></body></html>;
}
