import Link from "next/link";
export default function AdminPage() {
  return <main className="container page-shell"><div className="eyebrow gold-text">BUSINESS CONTROL CENTRE</div><h1 className="page-title">Admin <em>workspace.</em></h1><p className="muted">Private Super Admin area planned for dealer approval, property moderation, enquiries, advertisements and reports.</p><div className="notice"><strong>Security note</strong><p>This preview does not grant admin access. Production admin access must be assigned manually to a trusted account and enforced with database policies.</p></div><Link className="btn btn-outline" href="/login">Go to sign in</Link></main>;
}
