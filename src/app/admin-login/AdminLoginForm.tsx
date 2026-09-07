"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";

function GoogleMark() {
  return <svg aria-hidden="true" className="google-mark" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.3c1.9-1.8 2.9-4.4 2.9-7.4Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.5c-.9.6-2.1 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2H3v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3a10 10 0 0 0 0 9l3.4-2.6Z"/><path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.9 1.5l2.9-2.9A9.7 9.7 0 0 0 3 7.5l3.4 2.6A6 6 0 0 1 12 5.9Z"/></svg>;
}

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

  function continueWithGoogle() {
    const next = search.get("next");
    const returnTo = next?.startsWith("/admin") ? next : "/admin/members";
    window.location.assign(`/api/admin/google?next=${encodeURIComponent(returnTo)}`);
  }

  return <div className="admin-login-shell">
    <p className="admin-login-kicker">Administrator access</p>
    <h2>Welcome back</h2>
    <p className="admin-login-intro">Sign in to continue to your private workspace.</p>

    <button className="admin-google-button" type="button" onClick={continueWithGoogle}><GoogleMark /> Continue with Google</button>
    <div className="admin-login-divider"><span>or</span></div>

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
