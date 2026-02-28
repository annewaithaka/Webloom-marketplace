import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="card">
      <h1 className="h1">404</h1>
      <p className="muted">That page doesn’t exist.</p>
      <Link className="btn" to="/">Go home</Link>
    </section>
  );
}
