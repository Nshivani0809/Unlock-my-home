"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type SellerKind = "individual" | "builder" | "agent" | "dealer";
type DocumentKind = "identity" | "ownership_authority" | "business" | "rera";
type Profile = { id: string; full_name: string | null; phone: string | null; account_type: string; onboarding_status: string; business_name: string | null; seller_kind: SellerKind | null; dealer_status: string };

const documentLabels: Record<DocumentKind, string> = {
  identity: "Government-issued identity proof",
  ownership_authority: "Property ownership / owner authorisation proof",
  business: "Business / agency / builder proof",
  rera: "RERA registration proof (if applicable)",
};

export default function DealerOnboardingPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sellerKind, setSellerKind] = useState<SellerKind>("dealer");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [files, setFiles] = useState<Partial<Record<DocumentKind, File>>>({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) { router.replace("/login?next=/dealer/onboarding"); return; }
        const { data, error } = await supabase.from("profiles")
          .select("id,full_name,phone,account_type,onboarding_status,business_name,seller_kind,dealer_status")
          .eq("id", user.id).single();
        if (error) throw error;
        if (!active) return;
        setProfile(data as Profile);
        setBusinessName(data.business_name ?? "");
        setPhone(data.phone ?? "");
        if (data.seller_kind) setSellerKind(data.seller_kind);
      } catch (error) {
        if (active) setMessage(error instanceof Error ? error.message : "Unable to load your seller profile.");
      } finally { if (active) setLoading(false); }
    }
    void load();
    return () => { active = false; };
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile) return;
    if (!files.identity) { setMessage("Please attach an identity document to continue."); return; }
    if ((sellerKind === "dealer" || sellerKind === "agent" || sellerKind === "builder") && !files.business) {
      setMessage("Please attach a business, agency or builder proof document."); return;
    }
    if (sellerKind === "individual" && !files.ownership_authority) {
      setMessage("Please attach ownership or authorisation proof for an individual seller."); return;
    }
    setBusy(true); setMessage("");
    try {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw userError ?? new Error("Please sign in again.");

      const { error: profileError } = await supabase.from("profiles").update({
        phone: phone.trim(),
        business_name: businessName.trim() || null,
        seller_kind: sellerKind,
        onboarding_status: "submitted",
      }).eq("id", user.id);
      if (profileError) throw profileError;

      const selected = Object.entries(files) as [DocumentKind, File][];
      for (const [kind, file] of selected) {
        const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").slice(-90);
        const path = user.id + "/verification/" + Date.now() + "-" + kind + "-" + safeName;
        const { error: uploadError } = await supabase.storage.from("property-private").upload(path, file, { upsert: false, contentType: file.type });
        if (uploadError) throw uploadError;
        const { error: recordError } = await supabase.from("seller_verifications").insert({
          profile_id: user.id, verification_type: kind, document_path: path, status: "pending",
        });
        if (recordError) throw recordError;
      }
      setMessage("Your seller details and documents have been submitted. Our team will review them. Your account cannot publish listings until approval.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We could not submit your documents. Please try again.");
    } finally { setBusy(false); }
  }

  if (loading) return <main className="auth-shell"><section className="auth-card"><p className="muted">Loading your seller profile…</p></section></main>;
  if (!profile) return <main className="auth-shell"><section className="auth-card"><h1>Seller onboarding</h1><p className="auth-message" role="alert">{message || "Please sign in to continue."}</p><Link className="btn btn-gold auth-button-link" href="/login">Go to sign in</Link></section></main>;

  const alreadySubmitted = profile.onboarding_status === "submitted" || profile.onboarding_status === "under_review" || profile.onboarding_status === "approved";
  return <main className="auth-shell seller-onboarding-shell"><section className="auth-card auth-card-wide">
    <div className="eyebrow gold-text">SELLER VERIFICATION</div>
    <h1>Build trust before you <em>list.</em></h1>
    <p className="muted">Complete your seller profile and submit the documents needed for our team to review your account.</p>
    <div className="verification-status"><span>Current review status</span><strong>{profile.onboarding_status.replaceAll("_", " ")}</strong><small>{profile.dealer_status === "approved" ? "Your dealer access is approved." : "Listings remain unavailable until an administrator approves your account."}</small></div>
    {alreadySubmitted ? <div className="auth-hint">Your onboarding has already been submitted. If you need to provide additional information, please contact Unlock My Home support. You can return to your dashboard to check your status.</div> :
    <form className="auth-form" onSubmit={submit}>
      <div className="auth-two-col">
        <label>Seller type<select value={sellerKind} onChange={e=>setSellerKind(e.target.value as SellerKind)}><option value="individual">Individual property owner</option><option value="dealer">Property dealer</option><option value="agent">Real-estate agent</option><option value="builder">Builder / developer</option></select></label>
        <label>Business / agency name (if applicable)<input value={businessName} onChange={e=>setBusinessName(e.target.value)} placeholder="Business or agency name"/></label>
      </div>
      <label>Mobile number<input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91 mobile number" required/><small className="field-note">Phone OTP verification will be enabled after the SMS provider is configured. This number is never shown on public property listings.</small></label>
      <div className="document-upload-list">
        {(Object.keys(documentLabels) as DocumentKind[]).map(kind => <label className="document-upload" key={kind}>
          <span>{documentLabels[kind]}{(kind === "identity" || (sellerKind === "individual" && kind === "ownership_authority") || (sellerKind !== "individual" && kind === "business")) ? " *" : " (optional)"}</span>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={e=>setFiles(current=>({...current,[kind]:e.target.files?.[0]}))}/>
          <small>{files[kind]?.name ?? "PDF, JPG or PNG · maximum 20 MB"}</small>
        </label>)}
      </div>
      <div className="privacy-note"><strong>Protect your identity:</strong> Do not upload an unmasked Aadhaar copy or share your full Aadhaar number. Use a suitable alternative ID or a properly masked document. Documents are stored in private storage for authorised review only.</div>
      <button className="btn btn-gold" disabled={busy}>{busy ? "Submitting securely…" : "Submit for verification"}</button>
    </form>}
    {message && <p className="auth-message" role="status">{message}</p>}
    <p className="demo-note">Your identity documents and phone number are not displayed publicly. Only approved property information will appear on the website.</p>
    <Link className="text-link" href="/dealer">← Back to dealer workspace</Link>
  </section></main>;
}
