// =========================================
// FILE: frontend/src/components/Field.jsx
// =========================================
import React from "react";

export default function Field({
  label,
  hint,
  error,
  children,
}) {
  const showError = Boolean(error);

  return (
    <label className="field">
      <span className="field__label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span>{label}</span>
        {showError ? (
          <span
            title={error}
            aria-label={error}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 18,
              height: 18,
              borderRadius: 999,
              border: "1px solid var(--wb-danger, #dc2626)",
              color: "var(--wb-danger, #dc2626)",
              fontWeight: 800,
              fontSize: 12,
              lineHeight: "18px",
            }}
          >
            !
          </span>
        ) : null}
      </span>

      {children}

      {showError ? (
        <span className="muted" style={{ display: "block", marginTop: 6, color: "var(--wb-danger, #dc2626)" }}>
          {error}
        </span>
      ) : hint ? (
        <span className="muted" style={{ display: "block", marginTop: 6 }}>
          {hint}
        </span>
      ) : null}
    </label>
  );
}
