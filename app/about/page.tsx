import Link from "next/link";
export default function AboutPage() {
  return <main className="container page-shell"><div className="eyebrow gold-text">ABOUT UNLOCK MY HOME</div><h1 className="page-title">A clearer path to <em>your next home.</em></h1><p className="muted">Discover · Compare · Visit · Own. We help buyers explore properties for sale, compare their options and connect with the right people before making a decision.</p><div className="notice"><strong>Our approach</strong><p>Clear property information, direct enquiries and a considered journey from discovery to site visit. Property details are subject to verification and buyer due diligence.</p></div><Link className="btn btn-gold" href="/properties">Explore properties</Link></main>;
}
