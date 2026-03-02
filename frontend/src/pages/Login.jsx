// =========================================
// FILE: frontend/src/pages/Login.jsx
// =========================================
import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../lib/api.js";
import Field from "../components/Field.jsx";
import PasswordField from "../components/PasswordField.jsx";

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function friendlyLoginError(err) {
  const status = err?.status;
  const apiErr = err?.body?.error;
  const msg = apiErr || err?.message || "";

  if (status === 401) {
    if (String(msg).toLowerCase().includes("not verified")) {
      return "Your email isn’t verified yet. Check your email (or resend verification) and try again.";
    }
    return "Invalid email or password. If you don’t have an account yet, register first.";
  }

  if (status === 400) return msg || "Please check your details and try again.";
  return msg || "Login failed. Please try again.";
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/organizations";

  const [form, setForm] = useState({ email: "", password: "" });
  const [state, setState] = useState({ status: "idle", error: null });
  const [touched, setTouched] = useState({ email: false, password: false });

  const errors = useMemo(() => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!isEmail(form.email)) e.email = "Enter a valid email address.";

    if (!form.password) e.password = "Password is required.";
    return e;
  }, [form]);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function markTouched(key) {
    setTouched((t) => ({ ...t, [key]: true }));
  }

  function showError(key) {
    return touched[key] ? errors[key] : "";
  }

  async function onSubmit(e) {
    e.preventDefault();

    setTouched({ email: true, password: true });

    if (Object.keys(errors).length) {
      setState({ status: "error", error: { message: "Please fix the highlighted fields." } });
      return;
    }

    setState({ status: "loading", error: null });

    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate(from, { replace: true });
    } catch (error) {
      setState({ status: "error", error });
    }
  }

  const canSubmit = Object.keys(errors).length === 0 && state.status !== "loading";

  return (
    <section className="auth">
      <div className="card auth__card">
        <h1 className="h1">Login</h1>
        <p className="sub">Sign in to manage organizations and subscriptions.</p>

        {state.status === "error" && state.error && !Object.keys(errors).length && (
          <div className="notice notice--error">
            <strong>Login failed</strong>
            <p className="muted">{friendlyLoginError(state.error)}</p>
            <p className="muted" style={{ marginTop: 8 }}>
              Don’t have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        )}

        <form className="form" onSubmit={onSubmit} noValidate>
          <Field label="Email" error={showError("email")}>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              onBlur={() => markTouched("email")}
              required
              autoComplete="email"
            />
          </Field>

          <PasswordField
            label="Password"
            value={form.password}
            onChange={(e) => setField("password", e.target.value)}
            autoComplete="current-password"
            minLength={1}
            required
            error={showError("password")}
          />

          <button className="btn btn--full" type="submit" disabled={!canSubmit}>
            {state.status === "loading" ? "Signing in…" : "Login"}
          </button>

          <p className="muted" style={{ marginTop: 12 }}>
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
