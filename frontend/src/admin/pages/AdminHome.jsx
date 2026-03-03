import React, { useEffect, useState } from "react";
import { adminMe } from "../../lib/api.js";

export default function AdminHome() {
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await adminMe();
        if (alive) setMe(res?.admin || null);
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load admin profile");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div>
      <h2>Welcome Admin</h2>
      {error ? <p>{error}</p> : null}
      {me ? (
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }}>
          <div>
            <strong>{me.name}</strong>
          </div>
          <div>{me.email}</div>
          <div style={{ opacity: 0.75 }}>{me.role}</div>
        </div>
      ) : null}
    </div>
  );
}
