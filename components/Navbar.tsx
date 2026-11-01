import Link from "next/link";

const links = [
  { label: "Home", href: "/" },
  { label: "Buy", href: "/properties" },
  { label: "New Projects", href: "/properties?category=new-projects" },
  { label: "Resale", href: "/properties?category=resale" },
  { label: "Plots", href: "/properties?category=plots" },
  { label: "Commercial", href: "/properties?category=commercial" },
  { label: "Sell With Us", href: "/sell" },
  { label: "Partner With Us", href: "/partner" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  return (
    <header className="nav-wrap">
      <nav className="nav container" aria-label="Main navigation">
        <Link href="/" className="brand">
          <span className="brand-mark">⌂</span>
          <span>UNLOCK <b>MY HOME</b><small>Discover · Compare · Visit · Own</small></span>
        </Link>
        <div className="nav-links">
          {links.map((link) => <Link key={link.label} href={link.href}>{link.label}</Link>)}
        </div>
        <div className="nav-actions">
          <Link className="login-link" href="/login">Login</Link>
          <Link className="btn btn-gold btn-small" href="/register">Get Started</Link>
        </div>
      </nav>
    </header>
  );
}
