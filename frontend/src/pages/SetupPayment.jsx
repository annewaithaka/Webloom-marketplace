// =========================================
// FILE: frontend/src/pages/SetupPayment.jsx
// =========================================
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getMe, getToken, popFlash } from "../lib/api.js";
import { formatKES } from "../utils/formatMoney";

export default function SetupPayment() {
  const flash = popFlash();
  const location = useLocation();

  const SUPPORT_EMAIL = "webloom.techies@gmail.com";
  const WHATSAPP_NUMBER_E164 = "+254783031211**"; // dummy for now

  const qs = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  // Query params (best case)
  const qpProduct = qs.get("product") || "";
  const qpProductName = qs.get("productName") || "";
  const qpPlan = qs.get("plan") || "";
  const qpPlanId = qs.get("planId") || "";
  const qpMonthly = Number(qs.get("monthly") || 0);
  const qpSetup = Number(qs.get("setup") || 0);

  // ✅ Fallback: last selection saved from Subscribe
  const lastSelection = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("webloom_last_selection");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  // Use query params if present, else fallback
  const selectedProduct = qpProduct || lastSelection?.product || "";
  const selectedProductName = qpProductName || lastSelection?.productName || "";
  const selectedPlan = qpPlan || lastSelection?.plan || "";
  const selectedPlanId = qpPlanId || lastSelection?.planId || "";
  const monthly =
    qpMonthly || Number(lastSelection?.monthly || 0);
  const setup =
    qpSetup || Number(lastSelection?.setup || 0);

  const [me, setMe] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        if (!getToken()) return;
        const data = await getMe();
        if (!mounted) return;
        setMe(data);
      } catch {
        // ignore; support links still work without personalization
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const { waLink, mailto, previewText } = useMemo(() => {
    const email = me?.user?.email || "";
    const owner = me?.user?.full_name || me?.user?.name || "";
    const biz = me?.client?.business_name || "";

    const productLine = selectedProductName
      ? `Product: ${selectedProductName} (${selectedProduct || "n/a"})`
      : selectedProduct
      ? `Product: ${selectedProduct}`
      : "";

    const priceLines = [
      monthly ? `Monthly fee: ${formatKES(monthly)}/month` : "",
      setup ? `Setup fee: ${formatKES(setup)} (one-time)` : "",
    ].filter(Boolean);

    const lines = [
      "Hi Webloom, I need help with setup payment and activating my account.",
      "",
      email ? `Email: ${email}` : null,
      owner ? `Owner: ${owner}` : null,
      biz ? `Business: ${biz}` : null,
      productLine || null,
      selectedPlan ? `Plan: ${selectedPlan}` : null,
      selectedPlanId ? `Plan ID: ${selectedPlanId}` : null,
      ...priceLines,
    ].filter(Boolean);

    const message = lines.join("\n");

    const waNumber = WHATSAPP_NUMBER_E164.replace("+", "").replace(/\D/g, "");
    const wa = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

    const subject = "Webloom setup payment help";
    const mail = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message)}`;

    return { waLink: wa, mailto: mail, previewText: message };
  }, [
    me,
    selectedProduct,
    selectedProductName,
    selectedPlan,
    selectedPlanId,
    monthly,
    setup,
  ]);

  return (
    <section className="auth">
      <div className="card auth__card">
        <h1 className="h1">Setup payment required</h1>
        <p className="sub">
          Your account is pending activation. You can browse products and plans,
          but actions are locked until the one-time setup fee is confirmed.
        </p>

        {flash && (
          <div className="notice notice--error">
            <strong>Action blocked</strong>
            <p className="muted">{flash}</p>
          </div>
        )}

        <div className="notice">
          <strong>Next steps</strong>
          <p className="muted">
            Our billing details (M-Pesa Paybill / bank) are being finalized. For
            now, please contact Webloom to complete setup payment and activate
            your account.
          </p>
          <ul className="muted" style={{ marginTop: 10 }}>
            <li>Share your business name and preferred plan</li>
            <li>We confirm the setup fee amount</li>
            <li>After payment confirmation, we activate your account</li>
          </ul>

          {(selectedProduct || selectedPlan) && (
            <p className="muted" style={{ marginTop: 10 }}>
              <span className="code">Selected:</span>{" "}
              {[selectedProductName || selectedProduct, selectedPlan]
                .filter(Boolean)
                .join(" • ")}
              {setup ? ` • Setup: ${formatKES(setup)}` : ""}
              {monthly ? ` • Monthly: ${formatKES(monthly)}/mo` : ""}
            </p>
          )}
        </div>

        <div className="row" style={{ marginTop: 14 }}>
          <Link className="btn btn--ghost" to="/">
            ← Back to Marketplace
          </Link>

          <a
            className="btn btn-primary"
            href={waLink}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp support
          </a>

          {/* ✅ More reliable than button + window.location */}
          <a className="btn" href={mailto}>
            Email support
          </a>
        </div>

        <div className="pre" style={{ marginTop: 14 }}>
          <div className="muted" style={{ marginBottom: 8 }}>
            Message preview (auto-filled)
          </div>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{previewText}</pre>
        </div>
      </div>
    </section>
  );
}
