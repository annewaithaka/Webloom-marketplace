import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function AppShell() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="container topbar__inner">
          <Link to="/" className="brand">
            <span className="brand__dot" aria-hidden="true" />
            Webloom Marketplace
          </Link>
          <nav className="nav">
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
