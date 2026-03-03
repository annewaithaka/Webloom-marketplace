import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminActivateClient, adminGetClient, adminSuspendClient } from "../../lib/api.js";

export default function AdminClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setBusy(true);
    setError("");
    try {
      const res = await adminGetClient(id);
      setClient(res?.client || null);
    } catch (e) {
      setError(e?.message || "Failed to load client");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void load();
  }, [id]);

  async function onActivate() {
    if (!confirm("Activate this client?")) return;
    setBusy(true);
    try {
      await adminActivateClient(id);
      await load();
    } catch (e) {
      setError(e?.message || "Activation failed");
    } finally {
      setBusy(false);
    }
  }

  async function onSuspend() {
    if (!confirm("Suspend this client?")) return;
    setBusy(true);
    try {
      await adminSuspendClient(id);
      await load();
    } catch (e) {
      setError(e?.message || "Suspend failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={() => navigate(-1)} style={{ marginBottom: 10 }}>
        ← Back
      </button>

      <h2>Client Detail</h2>
      {error ? <p>{error}</p> : null}
      {busy && !client ? <p>Loading...</p> : null}

      {client ? (
        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>{client.business_name}</div>
          <div style={{ opacity: 0.8 }}>Client #{client.id}</div>

          <hr style={{ margin: "12px 0", border: "none", borderTop: "1px solid #eee" }} />

          <div>
            <strong>Account status:</strong> {client.account_status}
          </div>
          <div>
            <strong>Status:</strong> {client.status}
          </div>
          <div>
            <strong>Owner:</strong> {client.owner?.name} — {client.owner?.email} — {client.owner?.phone}
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <button type="button" disabled={busy} onClick={onActivate}>
              Activate
            </button>
            <button type="button" disabled={busy} onClick={onSuspend}>
              Suspend
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
