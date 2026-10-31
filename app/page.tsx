import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { demoProperties } from "@/lib/properties";

export default function Home() {
  return <main>
    <section className="hero"><div className="hero-shade"></div><div className="container hero-content">
      <div className="kicker"><span></span> A MORE CONSIDERED WAY TO FIND PROPERTY</div>
      <h1>Find your place.<br/><em>Unlock its potential.</em></h1>
      <p className="hero-copy">Discover handpicked land and properties for sale across Hyderabad.</p>
      <form action="/properties" className="search-panel">
        <label><small>LOCATION</small><input name="location" placeholder="Area, locality or landmark"/></label>
        <label><small>PROPERTY TYPE</small><select name="type"><option value="">All property types</option><option>Residential Plot</option><option>Commercial Plot</option><option>Industrial Land</option><option>Agricultural Land</option></select></label>
        <label><small>BUDGET</small><select name="budget"><option value="">Any budget</option><option value="10000000">Under ₹1 crore</option><option value="30000000">Under ₹3 crore</option><option value="50000000">Under ₹5 crore</option></select></label>
        <button className="btn btn-gold" type="submit">Explore properties ↗</button>
      </form>
      <div className="hero-trust"><span>✧ Curated listings</span><span>✧ Dealer-led discovery</span><span>✧ Clear property details</span></div>
    </div></section>
    <section className="section container"><div className="section-heading"><div><div className="eyebrow gold-text">THE COLLECTION</div><h2>Properties worth<br/><em>looking closer at.</em></h2></div><Link className="text-link" href="/properties">Explore all properties ↗</Link></div>
      <div className="property-grid">{demoProperties.slice(0,3).map(p=><PropertyCard key={p.id} property={p}/>)}</div>
      <p className="demo-note">Design preview: sample listings and prices are illustrative, not live offers.</p>
    </section>
    <section className="dark-band" id="how-it-works"><div className="container dark-band-inner"><div><div className="eyebrow gold-text">A CLEARER PROPERTY JOURNEY</div><h2>Good decisions begin<br/><em>with better information.</em></h2></div><div className="steps"><div><b>01</b><strong>Discover</strong><p>Explore sale listings by location, land size and budget.</p></div><div><b>02</b><strong>Understand</strong><p>Review property details, media and available documents.</p></div><div><b>03</b><strong>Connect</strong><p>Enquire with the listing dealer and arrange a site visit.</p></div></div></div></section>
    <section className="dealer-cta container" id="dealers"><div><div className="eyebrow gold-text">FOR PROPERTY PROFESSIONALS</div><h2>Bring your listings<br/><em>to the right audience.</em></h2><p>Join our dealer network and manage your property listings through one dedicated dashboard.</p><Link className="btn btn-gold" href="/login?mode=dealer">Become a partner ↗</Link></div><div className="dealer-art"><div className="art-ring"></div><span>U/MH</span><small>YOUR PROPERTY.<br/>A WIDER AUDIENCE.</small></div></section>
  </main>;
}
