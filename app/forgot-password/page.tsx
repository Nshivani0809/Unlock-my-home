"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
export default function ForgotPasswordPage() {
 const [email,setEmail]=useState(""); const [message,setMessage]=useState(""); const [busy,setBusy]=useState(false);
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setMessage("");try{const supabase=createClient();const {error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:`${window.location.origin}/auth/callback?next=/update-password`});if(error)throw error;setMessage("If this email belongs to an account and email delivery is configured, a password reset link will be sent.");}catch(err){setMessage(err instanceof Error?err.message:"Unable to request a reset link.");}finally{setBusy(false);}}
 return <main className="auth-shell"><section className="auth-card"><div className="eyebrow gold-text">ACCOUNT RECOVERY</div><h1>Reset your <em>password.</em></h1><p className="muted">Enter the email address used for your account.</p><form className="auth-form" onSubmit={submit}><label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/></label><button className="btn btn-gold" disabled={busy}>{busy?"Sending…":"Send reset link"}</button></form>{message&&<p className="auth-message" role="status">{message}</p>}<Link className="text-link" href="/login">← Back to sign in</Link></section></main>;
}
