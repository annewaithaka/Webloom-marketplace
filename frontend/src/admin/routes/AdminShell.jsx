import React, { useMemo, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearAdminToken, getAdminToken } from "../../lib/api.js";

export default function AdminShell() {
  const navigate = useNavigate();
  const [bump, setBump] = useState(0);

  const isAuthed = useMemo(() => {
    void bump;
    return Boolean(getAdminToken());
  }, [bump]);

  function logout() {
    clearAdminToken();
    setBump((x) => x + 1);
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="app" style={{ minHeight: "100vh" }}>
      <header className="topbar">
        <div className="container topbar__inner">
          <Link to="/admin" className="brand">
            <span className="brand__dot" aria-hidden="true" />
            Webloom Admin
          </Link>

          <nav className="nav">
            <Link className="nav__link" to="/admin">
              Dashboard
            </Link>
            <Link className="nav__link" to="/">
              Marketplace
            </Link>
            {isAuthed ? (
              <button className="nav__link nav__button" onClick={logout} type="button">
                Logout
              </button>
            ) : null}
          </nav>
        </div>
      </header>

      <main className="container main" style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 16 }}>
        <aside style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, height: "fit-content" }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Modules</div>
          <div style={{ display: "grid", gap: 8 }}>
            <Link to="/admin">Home</Link>
            <Link to="/admin/clients">Clients</Link>
            <span style={{ opacity: 0.6 }}>Payments (next)</span>
            <span style={{ opacity: 0.6 }}>Catalog (next)</span>
            <span style={{ opacity: 0.6 }}>Audit (next)</span>
          </div>
        </aside>

        <section>
          <Outlet />
        </section>
      </main>
    </div>
  );
}
