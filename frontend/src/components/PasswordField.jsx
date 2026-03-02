// =========================================
// FILE: frontend/src/components/PasswordField.jsx
// =========================================
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Field from "./Field.jsx";

export default function PasswordField({
  label = "Password",
  value,
  onChange,
  name = "password",
  autoComplete = "current-password",
  minLength = 6,
  required = true,
  error,
  hint,
}) {
  const [show, setShow] = useState(false);

  return (
    <Field label={label} error={error} hint={hint}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          className="input"
          style={{ flex: 1 }}
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          minLength={minLength}
          required={required}
        />
        <button
          type="button"
          className="btn"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          title={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </Field>
  );
}
