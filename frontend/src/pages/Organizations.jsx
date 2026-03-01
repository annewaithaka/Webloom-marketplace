// frontend/src/pages/Organizations.jsx
import React, { useEffect, useState } from "react";
import { createOrganization, getOrganizations } from "../lib/api.js";

function normalize(value) {
  return String(value ?? "").trim();
}

export default function Organizations() {
  const [list, setList] = useState({ status: "loading", items: [], error: null });
  const [form, setForm] = useState({ organization_name: "", organization_owner: "" });
  const [createState, setCreateState] = useState({ status: "idle", error: null });

  async function load() {
    setList({ status: "loading", items: [], error: null });
    try {
      const items = await getOrganizations();
      setList({ status: "success", items, error: null });
    } catch (error) {
      setList({ status: "error", items: [], error });
    }
  }

  useEffect(() => {
    load();
  }, []);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const canSubmit =
    normalize(form.organization_name).length > 0 && normalize(form.organization_owner).length > 0;

  async function onCreate(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setCreateState({ status: "loading", error: null });
    try {
      await createOrganization({
        organization_name: normalize(form.organization_name),
        organization_owner: normalize(form.organization_owner),
      });
      setCreateState({ status: "success", error: null });
      setForm({ organization_name: "", organization_owner: "" });
      await load();
    } catch (error) {
      setCreateState({ status: "error", error });
    }
  }

  return (
    <section>
      <h1 className="h1">Organizations</h1>
      <p className="sub">Create and manage branches.</p>

      <div className="grid">
        <div className="card card--span-5">
          <h2 className="h2">Create organization</h2>
          <p className="muted">
            This calls <span className="code">POST /organizations</span> with your JWT token.
          </p>

          {createState.status === "error" && (
            <div className="notice notice--error">
              <strong>Create failed</strong>
              <p className="muted">{createState.error?.message || "Unknown error"}</p>
              {createState.error?.body && (
                <pre className="pre">{JSON.stringify(createState.error.body, null, 2)}</pre>
              )}
            </div>
          )}

          {createState.status === "success" && (
            <div className="notice">
              <strong>Created!</strong>
              <p className="muted">Organization saved.</p>
            </div>
          )}

          <form className="form" onSubmit={onCreate}>
            <label className="field">
              <span className="field__label">Organization name</span>
              <input
                className="input"
                value={form.organization_name}
                onChange={(e) => setField("organization_name", e.target.value)}
                required
              />
            </label>

            <label className="field">
              <span className="field__label">Organization owner</span>
              <input
                className="input"
                value={form.organization_owner}
                onChange={(e) => setField("organization_owner", e.target.value)}
                required
              />
            </label>

            <button className="btn btn--full" type="submit" disabled={!canSubmit || createState.status === "loading"}>
              {createState.status === "loading" ? "Creating…" : "Create organization"}
            </button>
          </form>
        </div>

        <div className="card card--span-7">
          <div className="row">
            <h2 className="h2">Your organizations</h2>
            <button className="btn btn--ghost" type="button" onClick={load} disabled={list.status === "loading"}>
              Refresh
            </button>
          </div>

          {list.status === "loading" && <p className="muted">Loading…</p>}

          {list.status === "error" && (
            <div className="notice notice--error">
              <strong>Couldn’t load</strong>
              <p className="muted">{list.error?.message || "Unknown error"}</p>
            </div>
          )}

          {list.status === "success" &&
            (list.items.length ? (
              <ul className="list">
                {list.items.map((o) => (
                  <li key={o.id || o.organization_name} className="list__item">
                    <div>
                      <div className="list__title">{o.organization_name || o.name}</div>
                      <div className="muted">
                        Owner: <span className="code">{o.organization_owner || o.owner}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">No organizations yet. Create your first branch.</p>
            ))}
        </div>
      </div>
    </section>
  );
}
