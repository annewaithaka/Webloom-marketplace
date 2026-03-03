import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { adminGetClients } from "../../lib/api.js";

const STATUSES = ["", "PENDING_SETUP_PAYMENT", "ACTIVE", "SUSPENDED"];

export default function AdminClients() {
  const [q, setQ] = useState("");
  const [accountStatus, setAccountStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const queryKey = useMemo(
    () => JSON.stringify({ q, accountStatus, page, pageSize }),
    [q, accountStatus, page, pageSize]
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      setBusy(true);
      setError("");
      try {
        const res = await adminGetClients({
          q,
          account_status: accountStatus,
          page,
          page_size: pageSize,
        });
        if (!alive) return;
        setData(res);
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Failed to load clients");
      } finally {
        if (alive) setBusy(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [queryKey]);

  function onSearchSubmit(e) {
    e.preventDefault();
    setPage(1);
  }

  const totalPages = data?.total_pages || 0;
  const canPrev = page > 1;
  const canNext = totalPages ? page < totalPages : (data?.items?.length || 0) === pageSize;

  return (
    <div>
      <h2>Clients</h2>

      <form
        onSubmit={onSearchSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 260px 120px 120px",
          gap: 10,
          alignItems: "end",
        }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span>Search</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="business, name, email, phone"
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Account status</span>
          <select
            value={accountStatus}
            onChange={(e) => {
              setAccountStatus(e.target.value);
              setPage(1);
            }}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s || "All"}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Page size</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={busy}>
          {busy ? "Loading..." : "Search"}
        </button>
      </form>

      {error ? <p style={{ marginTop: 12 }}>{error}</p> : null}

      <div style={{ marginTop: 14, border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th style={{ textAlign: "left", padding: 10 }}>Client</th>
              <th style={{ textAlign: "left", padding: 10 }}>Owner</th>
              <th style={{ textAlign: "left", padding: 10 }}>Account status</th>
              <th style={{ textAlign: "left", padding: 10 }}>Created</th>
              <th style={{ textAlign: "left", padding: 10 }} />
            </tr>
          </thead>
          <tbody>
            {(data?.items || []).map((c) => (
              <tr key={c.id} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: 10 }}>
                  <div style={{ fontWeight: 700 }}>{c.business_name}</div>
                  <div style={{ opacity: 0.75 }}>Client #{c.id}</div>
                </td>
                <td style={{ padding: 10 }}>
                  <div>{c.owner?.name || "-"}</div>
                  <div style={{ opacity: 0.75 }}>{c.owner?.email || "-"}</div>
                  <div style={{ opacity: 0.75 }}>{c.owner?.phone || "-"}</div>
                </td>
                <td style={{ padding: 10 }}>{c.account_status}</td>
                <td style={{ padding: 10 }}>
                  {c.created_at ? new Date(c.created_at).toLocaleString() : "-"}
                </td>
                <td style={{ padding: 10 }}>
                  <Link to={`/admin/clients/${c.id}`}>View</Link>
                </td>
              </tr>
            ))}

            {!busy && (data?.items || []).length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 14, opacity: 0.7 }}>
                  No clients found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
        <button type="button" disabled={!canPrev || busy} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Prev
        </button>
        <div style={{ opacity: 0.8 }}>
          Page <strong>{page}</strong> {totalPages ? <>of <strong>{totalPages}</strong></> : null} — Total{" "}
          <strong>{data?.total || 0}</strong>
        </div>
        <button type="button" disabled={!canNext || busy} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
