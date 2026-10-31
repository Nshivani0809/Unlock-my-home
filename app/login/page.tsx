import Link from "next/link";
export default function LoginPage() {
  return <main className="auth-shell"><div className="auth-card"><div className="eyebrow gold-text">WELCOME TO UNLOCK MY HOME</div><h1>Sign in to <em>continue.</em></h1><p className="muted">Buyer, dealer and seller access will be enabled when Supabase authentication is configured.</p>
    <form className="auth-form" action="#"><label>Email address<input type="email" placeholder="you@example.com" required/></label><label>Password<input type="password" placeholder="Your password" required/></label><button className="btn btn-gold" type="button" disabled>Authentication setup required</button></form>
    <p className="demo-note">Do not use real passwords on this preview. See README for secure authentication setup.</p><Link className="text-link" href="/">← Back to home</Link></div></main>;
}
