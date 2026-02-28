import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPlansBySlug } from "../api/marketplace";
import { formatKES } from "../utils/formatMoney";

export default function ProductPlans() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getPlansBySlug(slug);
        if (!mounted) return;
        setProduct(data.product);
        setPlans(data.plans || []);
      } catch (e) {
        if (!mounted) return;
        setError("Could not load plans.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [slug]);

  return (
    <div className="container">
      <div className="row" style={{ marginTop: 0 }}>
        <div>
          <div className="badge">Plans</div>
          <h1 className="h1">{product?.name || slug}</h1>
          <p className="p">Pick a plan. (Next step: attach it to an organization + subscription.)</p>
        </div>
        <Link className="btn" to="/">Back</Link>
      </div>

      {loading ? (
        <p className="p" style={{ marginTop: 16 }}>Loading…</p>
      ) : error ? (
        <p className="p" style={{ marginTop: 16 }}>{error}</p>
      ) : (
        <div className="grid" style={{ marginTop: 16 }}>
          {plans.map((pl) => (
            <div className="card" key={pl.id}>
              <div className="row" style={{ marginTop: 0 }}>
                <h2 className="h2" style={{ margin: 0 }}>{pl.name}</h2>
                <span className="badge">{formatKES(pl.price)}</span>
              </div>
              <p className="p">Duration: {pl.duration_days} days</p>

              {pl.features ? (
                <pre
                  style={{
                    marginTop: 12,
                    padding: 12,
                    borderRadius: 12,
                    border: "1px solid var(--wb-border)",
                    background: "#f8faf9",
                    overflowX: "auto",
                    fontSize: 12,
                  }}
                >
{JSON.stringify(pl.features, null, 2)}
                </pre>
              ) : null}

              <div className="row">
                <button className="btn btn-primary" disabled>
                  Choose plan (next step)
                </button>
              </div>
            </div>
          ))}
          {plans.length === 0 ? <p className="p">No plans yet.</p> : null}
        </div>
      )}
    </div>
  );
}
