"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AccountType = "buyer" | "owner" | "dealer";
export default function RegisterPage() {
  const [accountType, setAccountType] = useState<AccountType>("buyer");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState("");
  const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState(""); const [success, setSuccess] = useState(false); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("");
    if (password.length < 8) { setMessage("Please use a password with at least 8 characters."); return; }
    if (password !== confirm) { setMessage("Your passwords do not match."); return; }
    setBusy(true);
    try {
      const supabase = createClient();
      const role = accountType === "buyer" ? "buyer" : accountType === "dealer" ? "dealer" : "seller";
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(), password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback`, data: { full_name: name.trim(), phone: phone.trim(), role, account_type: accountType } }
      });
      if (error) throw error;
      if (data.session) setMessage("Your account is ready. You can now sign in.");
      else setSuccess(true);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to create your account. Please try again."); }
    finally { setBusy(false); }
  }
  if (success) return <main className="auth-shell"><section className="auth-card"><div className="eyebrow gold-text">ONE LAST STEP</div><h1>Check your <em>inbox.</em></h1><p className="muted">We have requested an account confirmation email for <strong>{email}</strong>. Open the message and follow its link to verify your email address.</p><p className="demo-note">During free-tier testing, Supabase may restrict which email addresses can receive confirmation messages. If no email arrives, check your Supabase Auth email settings.</p><Link className="btn btn-gold auth-button-link" href="/login">Go to sign in</Link></section></main>;
  return <main className="auth-shell"><section className="auth-card auth-card-wide"><div className="eyebrow gold-text">JOIN UNLOCK MY HOME</div><h1>Create your <em>account.</em></h1><p className="muted">One account for your property journey. You can browse properties without registering.</p>
    <form className="auth-form" onSubmit={submit}>
      <label>I want to…<select value={accountType} onChange={e=>setAccountType(e.target.value as AccountType)}><option value="buyer">Buy a property</option><option value="owner">Sell my own property</option><option value="dealer">Register as a property dealer</option></select></label>
      <label>Full name<input value={name} onChange={e=>setName(e.target.value)} autoComplete="name" placeholder="Your full name" required/></label>
      <div className="auth-two-col"><label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" required/></label><label>Mobile number<input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} autoComplete="tel" placeholder="Your mobile number" required/></label></div>
      <div className="auth-two-col"><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password" minLength={8} placeholder="At least 8 characters" required/></label><label>Confirm password<input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} autoComplete="new-password" placeholder="Enter password again" required/></label></div>
      {accountType === "dealer" && <p className="auth-hint">Dealer accounts require admin approval before you can publish property listings. We will collect business details separately.</p>}
      {accountType === "owner" && <p className="auth-hint">You can submit your own property after registration. Property details and ownership/authorisation documents are reviewed separately.</p>}
      <button className="btn btn-gold" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button>
    </form>{message && <p className="auth-message" role="alert">{message}</p>}<p className="auth-switch">Already have an account? <Link href="/login">Sign in</Link></p><p className="demo-note">By creating an account, you agree to our Terms and Privacy Policy. Please review these pages before public launch.</p></section></main>;
}
