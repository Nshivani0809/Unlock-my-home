import PropertyCard from "@/components/PropertyCard";
import { demoProperties } from "@/lib/properties";
export default async function PropertiesPage({ searchParams }: { searchParams: Promise<{ location?: string; type?: string; budget?: string; bhk?: string }> }) {
  const params = await searchParams;
  const items = demoProperties.filter(p => (!params.location || `${p.locality} ${p.city}`.toLowerCase().includes(params.location.toLowerCase())) && (!params.type || p.property_type === params.type) && (!params.budget || p.price_inr <= Number(params.budget)) );
  return <main className="container page-shell"><div className="eyebrow gold-text">THE PROPERTY COLLECTION</div><h1 className="page-title">Explore properties <em>for sale.</em></h1><p className="muted">Discover land opportunities across Hyderabad.</p>
    <form className="filter-bar"><input name="location" placeholder="Search locality" defaultValue={params.location}/><select name="type" defaultValue={params.type || ""}><option value="">All property types</option><option value="Apartment">Apartment</option><option value="Villa">Villa</option><option value="Independent Home">Independent Home</option><option value="Residential Plot">Residential Plot</option><option value="Commercial Space">Commercial Space</option></select><select name="budget" defaultValue={params.budget || ""}><option value="">Any budget</option><option value="5000000">Up to ₹50 lakh</option><option value="10000000">Up to ₹1 crore</option><option value="20000000">Up to ₹2 crore</option><option value="50000000">Up to ₹5 crore</option></select><button className="btn btn-gold">Apply filters</button></form>
    <div className="property-grid">{items.map(p=><PropertyCard key={p.id} property={p}/>)}</div>
    {items.length===0 && <p>No demo listings match those filters.</p>}
    <p className="demo-note">These are sample records for design review. Live listings will come from the connected database after setup.</p>
  </main>;
}
