// frontend/src/routes/AppShell.jsx
import React, { useMemo, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearToken, getToken } from "../lib/api.js";

export default function AppShell() {
  const navigate = useNavigate();
  const [bump, setBump] = useState(0);

  const isAuthed = useMemo(() => {
    void bump;
    return Boolean(getToken());
  }, [bump]);

  function logout() {
    clearToken();
    setBump((x) => x + 1);
    navigate("/login");
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="container topbar__inner">
          <Link to="/" className="brand">
            <span className="brand__dot" aria-hidden="true" />
            Webloom Marketplace
          </Link>

          <nav className="nav">
            <Link className="nav__link" to="/">
              Marketplace
            </Link>

            {isAuthed ? (
              <>
                <Link className="nav__link" to="/organizations">
                  Organizations
                </Link>
                <button className="nav__link nav__button" onClick={logout} type="button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="nav__link" to="/register">
                  Register
                </Link>
                <Link className="nav__link" to="/login">
                  Login
                </Link>
              </>
            )}

            <a className="nav__link" href="http://127.0.0.1:5000/health" target="_blank" rel="noreferrer">
              API Health
            </a>
          </nav>
        </div>
      </header>

      <main className="container main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <span>© {new Date().getFullYear()} Webloom</span>
        </div>
      </footer>
    </div>
  );
}
