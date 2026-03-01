// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login as loginApi, setToken } from "../lib/api.js";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [state, setState] = useState({ status: "idle", error: null });

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setState({ status: "loading", error: null });
    try {
      const body = await loginApi(form);

      const token =
        (body && typeof body === "object" && (body.token || body.access_token || body.jwt)) || null;

      if (!token) {
        throw new Error("Login succeeded but no token was returned by the backend.");
      }

      setToken(token);

      const redirectTo = location.state?.from || "/organizations";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setState({ status: "error", error });
    }
  }

  return (
    <section className="auth">
      <div className="card auth__card">
        <h1 className="h1">Login</h1>
        <p className="sub">Sign in to manage organizations.</p>

        {state.status === "error" && (
          <div className="notice notice--error">
            <strong>Login failed</strong>
            <p className="muted">{state.error?.message || "Unknown error"}</p>
            <p className="muted">
              If it says email not verified, open backend logs and use the verification link (or resend endpoint).
            </p>
          </div>
        )}

        <form className="form" onSubmit={onSubmit}>
          <label className="field">
            <span className="field__label">Email</span>
            <input className="input" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} required />
          </label>

          <label className="field">
            <span className="field__label">Password</span>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              required
            />
          </label>

          <button className="btn btn--full" type="submit" disabled={state.status === "loading"}>
            {state.status === "loading" ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}
