"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";

export default function AdminLoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setPending(true); setMessage("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      if (!response.ok) {
        const result = await response.json().catch(() => null) as { message?: string } | null;
        throw new Error(result?.message || "Unable to sign in.");
      }
      const next = search.get("next");
      router.replace(next?.startsWith("/admin") ? next : "/admin/members");
      router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to sign in."); }
    finally { setPending(false); }
  }

  return <div className="admin-login-shell">
    <p className="admin-login-kicker">Administrator access</p>
    <h2>Welcome back</h2>
    <p className="admin-login-intro">Sign in to continue to your private workspace.</p>

    <form onSubmit={submit} className="admin-login-form">
      <label htmlFor="admin-username">Username</label>
      <input id="admin-username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />

      <div className="admin-password-label"><label htmlFor="admin-password">Password</label><a href="mailto:support@cornerstonesocialcircle.com?subject=Admin password reset">Forgot password?</a></div>
      <div className="admin-password-field">
        <input id="admin-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
        <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff /> : <Eye />}</button>
      </div>

      <label className="admin-remember"><input type="checkbox" name="remember" /><span>Keep me signed in</span></label>
      {message && <p role="alert" className="admin-login-error">{message}</p>}
      <button className="admin-submit-button" disabled={pending}><LockKeyhole size={18} /> {pending ? "Signing in…" : "Sign in securely"}</button>
    </form>

    <div className="admin-security-rule"><span /><ShieldCheck /><span /></div>
    <p className="admin-private-label">Private &amp; secure</p>
  </div>;
}
