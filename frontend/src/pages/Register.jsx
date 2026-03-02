// =========================================
// FILE: frontend/src/pages/Register.jsx
// =========================================
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../lib/api.js";
import Field from "../components/Field.jsx";
import PasswordField from "../components/PasswordField.jsx";

function isFullName(value) {
  const parts = String(value || "").trim().split(/\s+/).filter(Boolean);
  return parts.length >= 2;
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

export default function Register() {
  const [form, setForm] = useState({
    business_name: "",
    owner_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [state, setState] = useState({ status: "idle", error: null, done: false });
  const [touched, setTouched] = useState({
    business_name: false,
    owner_name: false,
    email: false,
    phone: false,
    password: false,
  });

  const errors = useMemo(() => {
    const e = {};

    if (!form.business_name.trim()) e.business_name = "Business name is required.";
    if (!form.owner_name.trim()) e.owner_name = "Owner name is required.";
    else if (!isFullName(form.owner_name)) e.owner_name = "Enter first and last name (e.g. Anne Waithaka).";

    if (!form.email.trim()) e.email = "Email is required.";
    else if (!isEmail(form.email)) e.email = "Enter a valid email address.";

    if (!form.phone.trim()) e.phone = "Phone is required.";

    if (!form.password) e.password = "Password is required.";
    else if (String(form.password).length < 6) e.password = "Password must be at least 6 characters.";

    return e;
  }, [form]);

  const canSubmit = Object.keys(errors).length === 0 && state.status !== "loading";

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

    // Mark all fields touched so all “!” appear if invalid
    setTouched({
      business_name: true,
      owner_name: true,
      email: true,
      phone: true,
      password: true,
    });

    if (Object.keys(errors).length) {
      setState({ status: "error", error: { message: "Please fix the highlighted fields." }, done: false });
      return;
    }

    setState({ status: "loading", error: null, done: false });

    try {
      await register({
        ...form,
        business_name: form.business_name.trim(),
        owner_name: form.owner_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
      setState({ status: "success", error: null, done: true });
    } catch (error) {
      setState({ status: "error", error, done: false });
    }
  }

  return (
    <section className="auth">
      <div className="card auth__card">
        <h1 className="h1">Register</h1>
        <p className="sub">Create your account, then verify email (link prints in backend logs).</p>

        {state.status === "success" && state.done && (
          <div className="notice">
            <strong>Registered!</strong>
            <p className="muted">
              Open your backend terminal and copy the verification link printed under{" "}
              <span className="code">EMAIL VERIFICATION (DEV MODE)</span>, then visit it in the browser.
              After verification, you can log in.
            </p>
          </div>
        )}

        {state.status === "error" && state.error && (
          <div className="notice notice--error">
            <strong>Registration failed</strong>
            <p className="muted">{state.error?.body?.error || state.error?.message || "Unknown error"}</p>
          </div>
        )}

        <form className="form" onSubmit={onSubmit} noValidate>
          <Field label="Business name" error={showError("business_name")}>
            <input
              className="input"
              value={form.business_name}
              onChange={(e) => setField("business_name", e.target.value)}
              onBlur={() => markTouched("business_name")}
              required
            />
          </Field>

          <Field label="Owner name (first + last)" error={showError("owner_name")}>
            <input
              className="input"
              value={form.owner_name}
              onChange={(e) => setField("owner_name", e.target.value)}
              onBlur={() => markTouched("owner_name")}
              required
            />
          </Field>

          <Field label="Email" error={showError("email")}>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              onBlur={() => markTouched("email")}
              required
            />
          </Field>

          <Field label="Phone" error={showError("phone")}>
            <input
              className="input"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              onBlur={() => markTouched("phone")}
              required
            />
          </Field>

          <PasswordField
            label="Password"
            value={form.password}
            onChange={(e) => setField("password", e.target.value)}
            autoComplete="new-password"
            minLength={6}
            required
            error={showError("password")}
            hint="Minimum 6 characters."
          />

          <button className="btn btn--full" type="submit" disabled={!canSubmit}>
            {state.status === "loading" ? "Creating…" : "Create account"}
          </button>

          <p className="muted" style={{ marginTop: 12 }}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
