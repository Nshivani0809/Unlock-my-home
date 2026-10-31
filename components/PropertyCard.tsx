import Link from "next/link";
import type { Property } from "@/lib/properties";
import { formatINR } from "@/lib/properties";
export default function PropertyCard({ property }: { property: Property }) {
  return <article className="property-card">
    <Link href={`/properties/${property.slug}`} className="property-photo" style={{ backgroundImage: `url(${property.image_url || ""})` }}>
      {property.verified && <span className="verified">✓ VERIFIED LISTING</span>}
      <span className="photo-arrow">↗</span>
    </Link>
    <div className="property-info">
      <div className="eyebrow">{property.property_type} <span>·</span> {property.locality}</div>
      <h3><Link href={`/properties/${property.slug}`}>{property.title}</Link></h3>
      <div className="property-specs"><span>{property.area_sq_yards.toLocaleString("en-IN")} sq. yd.</span><span>{property.facing || "Facing on request"}</span><span>{property.road_width_ft ? `${property.road_width_ft} ft road` : "Road details"}</span></div>
      <div className="price-row"><strong>{formatINR(property.price_inr)}</strong><small>{formatINR(property.price_per_sq_yard || Math.round(property.price_inr / property.area_sq_yards))}/sq. yd.</small></div>
    </div>
  </article>;
}
