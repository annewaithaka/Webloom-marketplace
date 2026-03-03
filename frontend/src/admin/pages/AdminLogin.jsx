import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../lib/api.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await adminLogin({ email, password });
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 520, paddingTop: 40 }}>
      <h1 style={{ marginBottom: 6 }}>Admin Login</h1>
      <p style={{ opacity: 0.75, marginTop: 0 }}>Webloom Operations</p>

      {error ? (
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10, marginBottom: 12 }}>
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Password</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>

        <button type="submit" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
