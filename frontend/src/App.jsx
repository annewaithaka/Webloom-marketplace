// frontend/src/App.jsx
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./routes/AppShell.jsx";
import RequireAuth from "./routes/RequireAuth.jsx";

import Marketplace from "./pages/Marketplace.jsx";
import Plans from "./pages/Plans.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Organizations from "./pages/Organizations.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Marketplace />} />
        <Route path="/products/:slug/plans" element={<Plans />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/organizations"
          element={
            <RequireAuth>
              <Organizations />
            </RequireAuth>
          }
        />

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
