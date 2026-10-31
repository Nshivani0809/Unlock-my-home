import Link from "next/link";
export default function Navbar() {
  return <header className="nav-wrap"><nav className="nav container">
    <Link href="/" className="brand"><span className="brand-mark">⌂</span><span>UNLOCK <b>MY HOME</b><small>PREMIUM PROPERTY DISCOVERY</small></span></Link>
    <div className="nav-links"><Link href="/properties">Properties</Link><a href="#how-it-works">How it works</a><a href="#dealers">For dealers</a><a href="#contact">Contact</a></div>
    <div className="nav-actions"><Link className="login-link" href="/login">Login</Link><Link className="btn btn-gold btn-small" href="/login?mode=dealer">List a property</Link></div>
  </nav></header>;
}
