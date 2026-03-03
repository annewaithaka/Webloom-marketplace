import React, { useEffect, useMemo, useState } from "react";
import {
  adminCreateOnboardingPayment,
  adminConfirmOnboardingPayment,
  adminExportOnboardingPaymentsCsv,
  adminGetOnboardingPayments,
  adminRejectOnboardingPayment,
} from "../../lib/api.js";

const STATUSES = ["", "PENDING", "CONFIRMED", "REJECTED"];

export default function AdminOnboardingPayments() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [clientId, setClientId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // record form
  const [newClientId, setNewClientId] = useState("");
  const [amountKes, setAmountKes] = useState("");
  const [method, setMethod] = useState("manual");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  const queryKey = useMemo(
    () => JSON.stringify({ q, status, clientId, page, pageSize }),
    [q, status, clientId, page, pageSize]
  );

  async function load() {
    setBusy(true);
    setError("");
    try {
      const res = await adminGetOnboardingPayments({
        q,
        status,
        client_id: clientId,
        page,
        page_size: pageSize,
      });
      setData(res);
    } catch (e) {
      setError(e?.message || "Failed to load payments");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  async function onCreate(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminCreateOnboardingPayment({
        client_id: Number(newClientId),
        amount_kes: Number(amountKes),
        method,
        reference,
        notes,
      });
      setNewClientId("");
      setAmountKes("");
      setReference("");
      setNotes("");
      setPage(1);
      await load();
    } catch (e2) {
      setError(e2?.message || "Failed to record payment");
    } finally {
      setBusy(false);
    }
  }

  async function onConfirm(id) {
    if (!confirm("Confirm this payment?")) return;
    setBusy(true);
    setError("");
    try {
      await adminConfirmOnboardingPayment(id, { auto_activate: false });
      await load();
    } catch (e) {
      setError(e?.message || "Confirm failed");
    } finally {
      setBusy(false);
    }
  }

  async function onReject(id) {
    const reason = prompt("Reason for rejection? (optional)") || "";
    if (!confirm("Reject this payment?")) return;
    setBusy(true);
    setError("");
    try {
      await adminRejectOnboardingPayment(id, { reason });
      await load();
    } catch (e) {
      setError(e?.message || "Reject failed");
    } finally {
      setBusy(false);
    }
  }

  async function onExport() {
    setBusy(true);
    setError("");
    try {
      await adminExportOnboardingPaymentsCsv({ q, status, client_id: clientId });
    } catch (e) {
      setError(e?.message || "Export failed");
    } finally {
      setBusy(false);
    }
  }

  const totalPages = data?.total_pages || 0;
  const canPrev = page > 1;
  const canNext = totalPages ? page < totalPages : (data?.items?.length || 0) === pageSize;

  return (
    <div>
      <h2>Onboarding Payments</h2>

      <div style={{ display: "grid", gap: 12, marginBottom: 14 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 200px 160px 120px 120px",
            gap: 10,
            alignItems: "end",
          }}
        >
          <label style={{ display: "grid", gap: 6 }}>
            <span>Search</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="business, owner, ref" />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Status</span>
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s || "All"}</option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Client ID</span>
            <input value={clientId} onChange={(e) => { setClientId(e.target.value); setPage(1); }} placeholder="optional" />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Page size</span>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
              {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>

          <button type="button" onClick={onExport} disabled={busy}>
            Export CSV
          </button>
        </form>

        <form onSubmit={onCreate} style={{ display: "grid", gridTemplateColumns: "140px 160px 140px 1fr 1fr 120px", gap: 10, alignItems: "end" }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Client ID</span>
            <input value={newClientId} onChange={(e) => setNewClientId(e.target.value)} required />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Amount (KES)</span>
            <input value={amountKes} onChange={(e) => setAmountKes(e.target.value)} required />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Method</span>
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              {["manual", "mpesa", "bank", "cash"].map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Reference</span>
            <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="mpesa code/bank ref" />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Notes</span>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="optional" />
          </label>

          <button type="submit" disabled={busy}>Record</button>
        </form>
      </div>

      {error ? <p>{error}</p> : null}

      <div style={{ border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th style={{ textAlign: "left", padding: 10 }}>Payment</th>
              <th style={{ textAlign: "left", padding: 10 }}>Client</th>
              <th style={{ textAlign: "left", padding: 10 }}>Amount</th>
              <th style={{ textAlign: "left", padding: 10 }}>Status</th>
              <th style={{ textAlign: "left", padding: 10 }}>Ref</th>
              <th style={{ textAlign: "left", padding: 10 }} />
            </tr>
          </thead>
          <tbody>
            {(data?.items || []).map((p) => (
              <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: 10 }}>
                  <div style={{ fontWeight: 700 }}>#{p.id}</div>
                  <div style={{ opacity: 0.75 }}>{p.created_at ? new Date(p.created_at).toLocaleString() : "-"}</div>
                </td>
                <td style={{ padding: 10 }}>
                  <div style={{ fontWeight: 700 }}>{p.client?.business_name || "-"}</div>
                  <div style={{ opacity: 0.75 }}>Client #{p.client_id}</div>
                  <div style={{ opacity: 0.75 }}>{p.owner?.email || "-"}</div>
                </td>
                <td style={{ padding: 10 }}>{p.amount_kes} {p.currency}</td>
                <td style={{ padding: 10 }}>{p.status}</td>
                <td style={{ padding: 10 }}>{p.reference || "-"}</td>
                <td style={{ padding: 10 }}>
                  {p.status === "PENDING" ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="button" disabled={busy} onClick={() => onConfirm(p.id)}>Confirm</button>
                      <button type="button" disabled={busy} onClick={() => onReject(p.id)}>Reject</button>
                    </div>
                  ) : (
                    <span style={{ opacity: 0.7 }}>—</span>
                  )}
                </td>
              </tr>
            ))}

            {!busy && (data?.items || []).length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 14, opacity: 0.7 }}>No payments found.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
        <button type="button" disabled={!canPrev || busy} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
        <div style={{ opacity: 0.8 }}>
          Page <strong>{page}</strong> {totalPages ? <>of <strong>{totalPages}</strong></> : null} — Total{" "}
          <strong>{data?.total || 0}</strong>
        </div>
        <button type="button" disabled={!canNext || busy} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}
