import PropertyCard from "@/components/PropertyCard";
import { demoProperties } from "@/lib/properties";
export default async function PropertiesPage({ searchParams }: { searchParams: Promise<{ location?: string; type?: string }> }) {
  const params = await searchParams;
  const items = demoProperties.filter(p => (!params.location || `${p.locality} ${p.city}`.toLowerCase().includes(params.location.toLowerCase())) && (!params.type || p.property_type === params.type));
  return <main className="container page-shell"><div className="eyebrow gold-text">THE PROPERTY COLLECTION</div><h1 className="page-title">Explore properties <em>for sale.</em></h1><p className="muted">Discover land opportunities across Hyderabad.</p>
    <form className="filter-bar"><input name="location" placeholder="Search locality" defaultValue={params.location}/><select name="type" defaultValue={params.type || ""}><option value="">All types</option><option>Residential Plot</option><option>Commercial Plot</option><option>Industrial Land</option><option>Agricultural Land</option></select><button className="btn btn-gold">Apply filters</button></form>
    <div className="property-grid">{items.map(p=><PropertyCard key={p.id} property={p}/>)}</div>
    {items.length===0 && <p>No demo listings match those filters.</p>}
    <p className="demo-note">These are sample records for design review. Live listings will come from the connected database after setup.</p>
  </main>;
}
