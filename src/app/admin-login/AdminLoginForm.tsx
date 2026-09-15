"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function AdminLoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const search = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(() => search.get("error") || (search.get("reset") === "success" ? "Your password has been reset. You can sign in now." : ""));
  const [successMessage, setSuccessMessage] = useState(search.get("reset") === "success");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setPending(true); setMessage(""); setSuccessMessage(false);
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password, remember }) });
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
    <h1>Sign in</h1>

    {googleEnabled && <>
      <a className="admin-google-button" href={`/api/admin/google?next=${encodeURIComponent(search.get("next") || "/admin/members")}`}>
        <svg className="google-mark" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.02v2.53h3.24c1.9-1.75 2.98-4.33 2.98-7.39Z"/><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.38l-3.24-2.53c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.61A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.39 13.92A6.02 6.02 0 0 1 6.08 12c0-.67.12-1.32.31-1.92V7.47H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.53l3.35-2.61Z"/><path fill="#EA4335" d="M12 5.95c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.96 5.47l3.35 2.61C7.18 7.71 9.39 5.95 12 5.95Z"/></svg>
        Continue with Google
      </a>
      <div className="admin-login-divider">or use your password</div>
    </>}

    <form onSubmit={submit} className="admin-login-form">
      <label htmlFor="admin-username">Email or username</label>
      <input id="admin-username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" placeholder="you@company.com" required />

      <div className="admin-password-label"><label htmlFor="admin-password">Password</label><a href="/admin-forgot-password">Forgot password?</a></div>
      <div className="admin-password-field">
        <input id="admin-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="Enter your password" required />
        <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff /> : <Eye />}</button>
      </div>

      <label className="admin-remember"><input type="checkbox" name="remember" checked={remember} onChange={(event) => setRemember(event.target.checked)} /><span>Keep me signed in</span></label>
      {message && <p role={successMessage ? "status" : "alert"} className={successMessage ? "admin-reset-message" : "admin-login-error"}>{message}</p>}
      <button className="admin-submit-button" disabled={pending}><span>{pending ? "Signing in…" : "Sign in securely"}</span>{!pending && <ArrowRight size={19} />}</button>
    </form>
  </div>;
}
