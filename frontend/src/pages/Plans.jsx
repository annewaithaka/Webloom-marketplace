import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPlans } from "../lib/api.js";

export default function Plans() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: "loading", plans: [], error: null });

  useEffect(() => {
    let alive = true;
    getPlans(slug)
      .then((plans) => {
        if (!alive) return;
        setState({ status: "success", plans: Array.isArray(plans) ? plans : [], error: null });
      })
      .catch((error) => {
        if (!alive) return;
        setState({ status: "error", plans: [], error });
      });
    return () => { alive = false; };
  }, [slug]);

  return (
    <section>
      <div className="row">
        <div>
          <h1 className="h1">Plans</h1>
          <p className="sub">Product: <span className="code">{slug}</span></p>
        </div>
        <Link className="btn btn--ghost" to="/">← Back</Link>
      </div>

      {state.status === "loading" && <p className="muted">Loading plans…</p>}

      {state.status === "error" && (
        <div className="card">
          <h2 className="h2">Couldn’t load plans</h2>
          <p className="muted">{state.error?.message || "Unknown error"}</p>
        </div>
      )}

      {state.status === "success" && (
        state.plans.length ? (
          <div className="grid">
            {state.plans.map((pl) => (
              <article key={pl.slug || pl.id || pl.name} className="card">
                <div className="card__top">
                  <h2 className="h2">{pl.name || pl.slug}</h2>
                  <span className="pill">{pl.tier || "Plan"}</span>
                </div>
                <p className="muted">{pl.description || "No description provided."}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted">No plans found for this product.</p>
        )
      )}
    </section>
  );
}
