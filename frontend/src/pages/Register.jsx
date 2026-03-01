// frontend/src/pages/Register.jsx
import React, { useState } from "react";
import { register } from "../lib/api.js";

export default function Register() {
  const [form, setForm] = useState({
    business_name: "",
    owner_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [state, setState] = useState({ status: "idle", error: null, done: false });

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setState({ status: "loading", error: null, done: false });
    try {
      await register(form);
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

        {state.status === "error" && (
          <div className="notice notice--error">
            <strong>Registration failed</strong>
            <p className="muted">{state.error?.message || "Unknown error"}</p>
          </div>
        )}

        <form className="form" onSubmit={onSubmit}>
          <label className="field">
            <span className="field__label">Business name</span>
            <input
              className="input"
              value={form.business_name}
              onChange={(e) => setField("business_name", e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span className="field__label">Owner name</span>
            <input className="input" value={form.owner_name} onChange={(e) => setField("owner_name", e.target.value)} required />
          </label>

          <label className="field">
            <span className="field__label">Email</span>
            <input className="input" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} required />
          </label>

          <label className="field">
            <span className="field__label">Phone</span>
            <input className="input" value={form.phone} onChange={(e) => setField("phone", e.target.value)} required />
          </label>

          <label className="field">
            <span className="field__label">Password</span>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              minLength={6}
              required
            />
          </label>

          <button className="btn btn--full" type="submit" disabled={state.status === "loading"}>
            {state.status === "loading" ? "Creating…" : "Create account"}
          </button>
        </form>
      </div>
    </section>
  );
}
