import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { demoProperties } from "@/lib/properties";

const categories = [
  { title: "Apartments", sub: "Modern living spaces", type: "Apartment", icon: "▥" },
  { title: "Villas", sub: "Luxury & privacy", type: "Villa", icon: "⌂" },
  { title: "Independent Homes", sub: "Spacious & independent", type: "Independent Home", icon: "⌂" },
  { title: "Plots", sub: "Build your future", type: "Residential Plot", icon: "▱" },
  { title: "Commercial", sub: "Grow your business", type: "Commercial Plot", icon: "▦" },
  { title: "New Projects", sub: "Latest launches", type: "New Project", icon: "✦" },
];
const insights = [
  ["Home Buying", "Best Areas to Buy a 3 BHK in Hyderabad", "⌂"],
  ["Investment", "HMDA vs DTCP Plots: What You Should Know", "▱"],
  ["Home Loan", "How Much Home Loan Can You Get?", "₹"],
  ["Lifestyle", "Top Localities for Villas in Hyderabad", "⌂"],
];
export default function Home() {
  return <main>
    <section className="reference-hero">
      <div className="wrap reference-hero-inner">
        <div className="hero-eyebrow">Your trusted property partner</div>
        <h1>Find Your <em>Dream Home</em></h1>
        <p>Verified properties, trusted builders and expert guidance, all in one place.</p>
        <div className="hero-links"><span>Buy</span><span>Sell</span><span>New Projects</span><span>Resale</span><span>Plots</span><span>Commercial</span></div>
        <div className="loc-card"><b>Hyderabad</b>and surrounding areas</div>
      </div>
    </section>
    <div className="wrap reference-search-wrap">
      <form action="/properties" className="reference-search">
        <input name="location" aria-label="Search locality, project or builder" placeholder="Search locality, project or builder..."/>
        <select name="type" aria-label="Property type"><option value="">Property type: Any</option><option value="Apartment">Apartment</option><option value="Villa">Villa</option><option value="Independent Home">Independent Home</option><option value="Residential Plot">Plot</option><option value="Commercial Plot">Commercial</option></select>
        <select name="budget" aria-label="Budget"><option value="">Budget: Any</option><option value="5000000">Under 50L</option><option value="10000000">50L – 1 Cr</option><option value="20000000">1 Cr+</option></select>
        <select name="bhk" aria-label="BHK"><option value="">BHK: Any</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4+</option></select>
        <button className="search-btn" type="submit">Search</button>
      </form>
      <div className="cats">{categories.map(c=><Link className="cat" key={c.title} href={`/properties?type=${encodeURIComponent(c.type)}`}><span className="cat-icon">{c.icon}</span><b>{c.title}</b><span>{c.sub}</span></Link>)}</div>
    </div>
    <section className="reference-section">
      <div className="wrap feat">
        <div><div className="kicker">Featured properties</div><h2>Handpicked Properties for You</h2><p>Discover premium homes, verified listings and investment opportunities in Hyderabad and beyond.</p><Link href="/properties" className="btn-dark">View All Properties →</Link></div>
        <div><div className="feat-cards">{demoProperties.slice(0,3).map(p=><PropertyCard key={p.id} property={p}/>)}</div><div className="dots"><i/><i/><i/><i/></div><p className="note">Sample listings are shown for design preview. Live listings will appear after seller submissions are reviewed and approved.</p></div>
      </div>
    </section>
    <section className="reference-why">
      <div className="wrap why-grid">
        <div className="story-photo"><div className="story-cover"><h3>More Than Just Properties...</h3><p>We're your partner in finding the right home.</p><div className="play"><i>▶</i>Our promise to buyers</div></div></div>
        <div><div className="kicker">Why Unlock My Home</div><h2>Your Dream. Our Priority.</h2><p className="why-sub">We simplify your property journey with trusted advice, a transparent process and end-to-end support.</p>
          <div className="tiles"><div className="tile"><b>Verified Listings</b><span>Only genuine properties</span></div><div className="tile"><b>Trusted Builders</b><span>Checked before we list</span></div><div className="tile"><b>Expert Guidance</b><span>Personalised support</span></div><div className="tile"><b>Negotiation Support</b><span>Get the best deals</span></div><div className="tile"><b>Home Loan Assistance</b><span>Help understanding your options</span></div><div className="tile"><b>End-to-End Support</b><span>From search to possession</span></div></div>
        </div>
      </div>
    </section>
    <section className="reference-section">
      <div className="wrap"><div className="builders-head"><div><div className="kicker">Our builder partners</div><h2>Trusted by Leading Developers</h2><p>We work with reputed builders to bring you the best projects and exclusive offers.</p></div><Link href="/partner" className="see-all">Become a Partner →</Link></div>
        <div className="logo-row">{[1,2,3,4,5,6].map(n=><div className="logo-slot" key={n}>Partner logo</div>)}</div><p className="note">Builder logos will be displayed only after partner approval and written permission.</p>
      </div>
    </section>
    <section className="reference-banners"><div className="wrap banners">
      <div className="banner dark"><div className="kicker">Sell your property</div><h3>Have a Property to Sell?</h3><p>Reach serious buyers with expert support from listing to closing.</p><Link href="/sell" className="btn-cta">List Your Property →</Link></div>
      <div className="banner light"><div className="kicker">Need a home loan?</div><h3>Understand Your Home Loan Options</h3><p>Estimate your EMI and see roughly how much you may be able to borrow before you shortlist.</p><Link href="/calculator" className="btn-outline">Try the EMI calculator →</Link></div>
    </div></section>
    <section className="reference-insights"><div className="wrap"><div className="insights-head"><div><h2>Property Insights</h2><p>Tips, trends and expert advice to help you make better decisions.</p></div><Link href="/insights" className="see-all">View All Articles →</Link></div>
      <div className="articles">{insights.map(([category,title,icon])=><Link className="article" href="/insights" key={title}><div className="article-photo">{icon}</div><div className="article-body"><small>{category}</small><h4>{title}</h4><span>Read More →</span></div></Link>)}</div>
    </div></section>
  </main>;
}
