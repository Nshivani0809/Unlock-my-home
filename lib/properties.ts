export type Property = {
  id: string;
  title: string;
  slug: string;
  city: string;
  locality: string;
  property_type: string;
  area_sq_yards: number;
  price_inr: number;
  price_per_sq_yard?: number;
  facing?: string | null;
  road_width_ft?: number | null;
  image_url?: string | null;
  verified?: boolean;
  description?: string | null;
};

export const demoProperties: Property[] = [
  { id: "demo-1", title: "Premium residential plot near ORR", slug: "premium-residential-plot-orr", city: "Hyderabad", locality: "Kokapet", property_type: "Residential Plot", area_sq_yards: 300, price_inr: 27000000, price_per_sq_yard: 90000, facing: "East", road_width_ft: 40, image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=85", verified: true, description: "A well-positioned residential plot in a growing Hyderabad corridor." },
  { id: "demo-2", title: "Open plot in a peaceful neighbourhood", slug: "open-plot-peaceful-neighbourhood", city: "Hyderabad", locality: "Shamshabad", property_type: "Residential Plot", area_sq_yards: 400, price_inr: 16000000, price_per_sq_yard: 40000, facing: "North", road_width_ft: 30, image_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=85", verified: true, description: "Open land listing. Buyers should independently verify title and approvals." },
  { id: "demo-3", title: "Commercial land with road access", slug: "commercial-land-road-access", city: "Hyderabad", locality: "Kompally", property_type: "Commercial Space", area_sq_yards: 500, price_inr: 42000000, price_per_sq_yard: 84000, facing: "West", road_width_ft: 60, image_url: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1200&q=85", verified: false, description: "Commercial land opportunity. Listing details are illustrative demo data." },
  { id: "demo-4", title: "Investment plot close to upcoming growth corridor", slug: "investment-plot-growth-corridor", city: "Hyderabad", locality: "Miyapur", property_type: "Residential Plot", area_sq_yards: 250, price_inr: 17500000, price_per_sq_yard: 70000, facing: "South", road_width_ft: 30, image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85", verified: true, description: "Illustrative property card for the first design iteration." }
];
export const formatINR = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
