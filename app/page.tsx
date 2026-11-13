import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { demoProperties } from "@/lib/properties";

const categories = [
  { name: "Apartments", type: "Apartment", mark: "▥" },
  { name: "Villas", type: "Villa", mark: "⌂" },
  { name: "Independent Homes", type: "Independent Home", mark: "⌂" },
  { name: "Plots", type: "Plot", mark: "▱" },
  { name: "Commercial", type: "Commercial", mark: "▦" },
  { name: "New Projects", type: "New Project", mark: "✦" },
];

export default function Home() {
  return <main>
    <section className="hero"><div className="hero-shade"></div><div className="container hero-content">
      <div className="kicker">Your trusted property partner</div>
      <h1>Find Your <em>Dream Home</em></h1>
      <p className="hero-copy">Verified properties, trusted builders and expert guidance, all in one place.</p>
      <p className="hero-copy">Buy · Sell · New Projects · Resale · Plots · Commercial</p>
    </div></section>
    <div className="container"><form action="/properties" className="search-panel reference-search">
      <input className="field" name="location" placeholder="Search locality, project or builder..."/>
      <select className="field" name="type"><option value="">Any property type</option><option>Apartment</option><option>Villa</option><option>Independent Home</option><option>Plot</option><option>Commercial</option></select>
      <select className="field" name="budget"><option value="">Any budget</option><option value="5000000">Under ₹50L</option><option value="10000000">Under ₹1Cr</option><option value="20000000">Under ₹2Cr</option></select>
      <select className="field" name="bhk"><option value="">Any BHK</option><option value="1">1 BHK</option><option value="2">2 BHK</option><option value="3">3 BHK</option><option value="4">4+ BHK</option></select>
      <button className="btn btn-gold" type="submit">Search Properties</button>
    </form></div>
    <section className="section container"><div className="section-heading"><div><div className="eyebrow gold-text">EXPLORE BY CATEGORY</div><h2>Find the right property</h2></div></div>
      <div className="category-grid">{categories.map(c=><Link className="category-tile" key={c.name} href={`/properties?type=${encodeURIComponent(c.type)}`}><strong>{c.mark}</strong><span>{c.name}</span></Link>)}</div>
    </section>
    <section className="section soft-section" id="properties"><div className="container"><div className="section-heading"><div><div className="eyebrow gold-text">FEATURED PROPERTIES</div><h2>Handpicked Properties for You</h2><p className="muted">Explore properties in Hyderabad and surrounding areas.</p></div><Link className="btn btn-outline" href="/properties">View all properties ↗</Link></div>
      <div className="property-grid">{demoProperties.slice(0,3).map(p=><PropertyCard key={p.id} property={p}/>)}</div>
      <p className="demo-note">Design preview: sample listings and prices are illustrative, not live offers.</p>
    </div></section>
    <section className="section container" id="about"><div className="section-heading"><div><div className="eyebrow gold-text">WHY UNLOCK MY HOME</div><h2>Your Dream. Our Priority.</h2><p className="muted">A transparent property journey from discovery to ownership.</p></div></div>
      <div className="value-grid"><article className="value-tile"><h3>Verified Listings</h3><p>Admin-reviewed listing workflow and clear listing status.</p></article><article className="value-tile"><h3>Trusted Builders</h3><p>Partner profiles and builder information.</p></article><article className="value-tile"><h3>End-to-End Support</h3><p>Enquiry, visit requests and home-loan planning.</p></article></div>
    </section>
    <section className="section soft-section" id="seller"><div className="container seller-cta"><div><div className="eyebrow gold-text">SELL YOUR PROPERTY</div><h2>Have a Property to Sell?</h2><p className="muted">Share your property details with our team and submit it for review before it appears to buyers.</p><Link className="btn btn-gold" href="/sell">List your property ↗</Link></div><div className="seller-art"><span>⌂</span><small>YOUR PROPERTY.<br/>A WIDER AUDIENCE.</small></div></div></section>
    <section className="section container" id="tools"><div className="section-heading"><div><div className="eyebrow gold-text">PARTNER WITH US</div><h2>Grow with Unlock My Home</h2><p className="muted">Present your projects to prospective buyers across Hyderabad.</p></div><Link className="btn btn-outline" href="/partner">Become a partner ↗</Link></div></section>
  </main>;
}
