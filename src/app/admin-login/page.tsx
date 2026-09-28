import { Suspense } from "react";
import AdminLoginForm from "./AdminLoginForm";
import "./styles.css";

export default function AdminLoginPage() {
  return (
    <main className="admin-login-page">
      <section className="admin-auth-panel"><Suspense><AdminLoginForm googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)} /></Suspense></section>
    </main>
  );
}
