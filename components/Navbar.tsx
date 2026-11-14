"use client";
import Link from "next/link";
import { useState } from "react";
const links = [
  { label: "Home", href: "/" },
  { label: "Buy", href: "/properties" },
  { label: "New Projects", href: "/properties?category=new-projects" },
  { label: "Resale", href: "/properties?category=resale" },
  { label: "Plots", href: "/properties?type=Residential%20Plot" },
  { label: "Commercial", href: "/properties?type=Commercial%20Plot" },
  { label: "Sell With Us", href: "/sell" },
  { label: "Partner With Us", href: "/partner" },
  { label: "About Us", href: "/about" },
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  return <header className="nav-wrap"><nav className="nav wrap" aria-label="Main navigation">
    <Link href="/" className="brand" onClick={()=>setOpen(false)}><span className="brand-mark">⌂</span><span><span className="brand-name">Unlock My Home</span><small>Discover · Compare · Visit · Own</small></span></Link>
    <div className={`nav-links ${open ? "open" : ""}`}>{links.map(link=><Link key={link.label} href={link.href} onClick={()=>setOpen(false)}>{link.label}</Link>)}<Link className="mobile-login" href="/login" onClick={()=>setOpen(false)}>Login</Link></div>
    <div className="nav-actions"><Link className="login-link" href="/login">Login</Link><Link className="btn-cta" href="/register">Get Started</Link><button className="menu-btn" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={()=>setOpen(v=>!v)}><span/><span/><span/></button></div>
  </nav></header>;
}
