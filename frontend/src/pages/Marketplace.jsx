import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../lib/api.js";

export default function Marketplace() {
  const [state, setState] = useState({ status: "loading", products: [], error: null });

  useEffect(() => {
    let alive = true;
    getProducts()
      .then((products) => {
        if (!alive) return;
        setState({ status: "success", products: Array.isArray(products) ? products : [], error: null });
      })
      .catch((error) => {
        if (!alive) return;
        setState({ status: "error", products: [], error });
      });
    return () => { alive = false; };
  }, []);

  return (
    <section>
      <h1 className="h1">Marketplace</h1>
      <p className="sub">Browse products and available plans.</p>

      {state.status === "loading" && <p className="muted">Loading products…</p>}

      {state.status === "error" && (
        <div className="card">
          <h2 className="h2">Couldn’t load products</h2>
          <p className="muted">{state.error?.message || "Unknown error"}</p>
        </div>
      )}

      {state.status === "success" && (
        state.products.length ? (
          <div className="grid">
            {state.products.map((p) => (
              <article key={p.slug || p.id} className="card">
                <div className="card__top">
                  <h2 className="h2">{p.name || p.title || p.slug}</h2>
                  <span className="pill">Product</span>
                </div>
                <p className="muted">{p.description || "No description provided."}</p>
                <div className="card__actions">
                  <Link className="btn" to={`/products/${p.slug}/plans`}>View plans</Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted">No products found. Run backend seed: <span className="code">python seed.py</span></p>
        )
      )}
    </section>
  );
}
