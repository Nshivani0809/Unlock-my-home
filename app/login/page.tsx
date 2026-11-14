"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage(""); setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from("profiles").select("account_type").eq("id", user?.id ?? "").maybeSingle();
      const next = new URLSearchParams(window.location.search).get("next");
      const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
      router.replace(safeNext ?? (profile?.account_type === "dealer" || profile?.account_type === "owner" ? "/dealer" : "/"));
      router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to sign in. Please try again."); }
    finally { setBusy(false); }
  }
  return <main className="auth-shell"><section className="auth-card"><div className="eyebrow gold-text">WELCOME TO UNLOCK MY HOME</div><h1>Sign in to <em>continue.</em></h1><p className="muted">Access your saved properties, enquiries and seller dashboard.</p>
    <form className="auth-form" onSubmit={submit}><label>Email address<input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password<input type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><div className="auth-inline"><Link className="text-link" href="/forgot-password">Forgot password?</Link></div><button className="btn btn-gold" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button></form>
    {message && <p className="auth-message" role="alert">{message}</p>}<p className="auth-switch">New to Unlock My Home? <Link href="/register">Create an account</Link></p><Link className="text-link" href="/">← Back to home</Link></section></main>;
}
