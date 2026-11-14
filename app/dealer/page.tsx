import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DealerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dealer");
  const { data: profile } = await supabase.from("profiles")
    .select("full_name,account_type,onboarding_status,dealer_status,business_name")
    .eq("id", user.id).maybeSingle();
  if (!profile) redirect("/login");
  const status = profile.onboarding_status ?? "incomplete";
  const approved = profile.dealer_status === "approved" && status === "approved";
  return <main className="container page-shell">
    <div className="eyebrow gold-text">PARTNER WORKSPACE</div>
    <h1 className="page-title">Welcome{profile.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}.</h1>
    <p className="muted">Your private workspace for seller verification and property listings.</p>
    <section className="seller-status-card">
      <div><span className="eyebrow gold-text">ACCOUNT REVIEW</span><h2>{status.replaceAll("_", " ")}</h2><p>{approved ? "Your seller account is approved. Property submission access can be enabled for your account." : "Complete your seller profile and submit the requested documents. Our team must approve your account before you can publish property listings."}</p></div>
      <span className={approved ? "status-pill status-approved" : "status-pill"}>{approved ? "Approved" : "Review required"}</span>
    </section>
    <div className="portal-grid">
      <div className="portal-tile"><b>01</b><h3>Seller verification</h3><p>Submit identity, business and property-authorisation documents securely.</p><Link className="text-link" href="/dealer/onboarding">Open verification →</Link></div>
      <div className="portal-tile"><b>02</b><h3>My properties</h3><p>Property submission will be enabled after seller approval and completion of the listing workflow.</p><span className="muted">Coming in the next implementation stage</span></div>
      <div className="portal-tile"><b>03</b><h3>Enquiries</h3><p>Buyer enquiries will be routed through Unlock My Home without displaying your private phone number.</p><span className="muted">Coming in the next implementation stage</span></div>
    </div>
    {!approved && <Link className="btn btn-gold" href="/dealer/onboarding">Complete seller verification</Link>}
    {approved && <p className="auth-hint">Your account is approved. We are preparing the property listing tools for the next stage.</p>}
  </main>;
}
