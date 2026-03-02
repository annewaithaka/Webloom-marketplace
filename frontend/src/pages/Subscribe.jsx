// =========================================
// FILE: frontend/src/pages/Subscribe.jsx
// =========================================
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import { formatKES } from "../utils/formatMoney";
import { getToken } from "../lib/api.js";

export default function Subscribe() {
  const { productSlug, planId } = useParams();
  const navigate = useNavigate();

  const token = useMemo(() => getToken() || "", []);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [plan, setPlan] = useState(null);
  const [product, setProduct] = useState(null);
  const [orgs, setOrgs] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const plansRes = await axios.get(`${API_BASE_URL}/products/${productSlug}/plans`);
        if (!mounted) return;

        setProduct(plansRes.data.product);
        const found = (plansRes.data.plans ?? []).find((p) => String(p.id) === String(planId));
        setPlan(found ?? null);

        if (!token) return;

        const authHeaders = { Authorization: `Bearer ${token}` };

        const meRes = await axios.get(`${API_BASE_URL}/auth/me`, { headers: authHeaders });
        if (!mounted) return;
        setMe(meRes.data);

        const status = meRes.data?.client?.account_status;
        if (status !== "ACTIVE") return;

        const orgRes = await axios.get(`${API_BASE_URL}/organizations`, { headers: authHeaders });
        if (!mounted) return;

        const list = orgRes.data?.organizations ?? orgRes.data ?? [];
        setOrgs(Array.isArray(list) ? list : []);
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.error || e?.message || "Failed to load subscribe page");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [productSlug, planId, token]);

  if (loading) return <div className="page">Loading…</div>;
  if (error) return <div className="page error">{error}</div>;

  const accountStatus = me?.client?.account_status;

  function goToSetupPayment() {
    const selection = {
      product: product?.slug ?? productSlug,
      productName: product?.name ?? "",
      planId: String(planId),
      plan: plan?.name ?? "",
      monthly: Number(plan?.monthly_fee_kes ?? plan?.price ?? 0),
      setup: Number(plan?.setup_fee_kes ?? 0),
      savedAt: Date.now(),
    };
  
    // ✅ Persist selection for SetupPayment fallback
    sessionStorage.setItem("webloom_last_selection", JSON.stringify(selection));
  
    const qp = new URLSearchParams();
    qp.set("product", selection.product);
    qp.set("productName", selection.productName);
    qp.set("planId", selection.planId);
    if (selection.plan) qp.set("plan", selection.plan);
    qp.set("monthly", String(selection.monthly));
    qp.set("setup", String(selection.setup));
  
    navigate(`/setup-payment?${qp.toString()}`);
  }

  return (
    <div className="page">
      <h1>Subscribe</h1>

      <div className="card" style={{ marginTop: 12 }}>
        <h3>{product?.name ?? productSlug}</h3>
        <div className="muted">{plan?.name ?? `Plan #${planId}`}</div>

        {plan && (
          <div style={{ marginTop: 8 }}>
            <div className="price">
              {formatKES(Number(plan.monthly_fee_kes ?? plan.price ?? 0))}/month
            </div>
            {Number(plan.setup_fee_kes ?? 0) > 0 && (
              <div className="muted">+ {formatKES(plan.setup_fee_kes)} setup (one-time)</div>
            )}
          </div>
        )}
      </div>

      {!token && (
        <div className="card" style={{ marginTop: 12 }}>
          <div className="muted">Log in to continue.</div>
          <div style={{ marginTop: 12 }}>
            <Link className="btn" to="/login" state={{ from: `/subscribe/${productSlug}/${planId}` }}>
              Login
            </Link>
          </div>
        </div>
      )}

      {token && accountStatus && accountStatus !== "ACTIVE" && (
        <div className="card" style={{ marginTop: 12 }}>
          <div className="muted">
            Your account is <b>{accountStatus}</b>. Complete setup payment to activate.
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={goToSetupPayment} type="button">
              Go to setup payment
            </button>
          </div>
        </div>
      )}

      {token && accountStatus === "ACTIVE" && (
        <div className="card" style={{ marginTop: 12 }}>
          <h3>Select organization</h3>

          {orgs.length === 0 ? (
            <div className="muted">No organizations yet. Create one first from the Organizations page.</div>
          ) : (
            <select
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
              style={{ marginTop: 10, width: "100%", padding: 10 }}
            >
              <option value="">Choose an organization…</option>
              {orgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.organization_name ?? `Org #${o.id}`}
                </option>
              ))}
            </select>
          )}

          <div style={{ marginTop: 12 }}>
            <button className="btn" disabled={!selectedOrgId} type="button">
              Continue (stub)
            </button>
          </div>

          <div className="muted" style={{ marginTop: 10 }}>
            Payments/subscription provisioning will be added in Phase 2/3.
          </div>
        </div>
      )}
    </div>
  );
}
