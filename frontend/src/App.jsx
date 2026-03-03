// =========================================
// FILE: frontend/src/App.jsx
// =========================================
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./routes/AppShell.jsx";
import RequireAuth from "./routes/RequireAuth.jsx";

import AdminShell from "./admin/routes/AdminShell.jsx";
import RequireAdminAuth from "./admin/routes/RequireAdminAuth.jsx";
import AdminLogin from "./admin/pages/AdminLogin.jsx";
import AdminHome from "./admin/pages/AdminHome.jsx";

import Marketplace from "./pages/Marketplace.jsx";
import Plans from "./pages/Plans.jsx";
import Subscribe from "./pages/Subscribe.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import SetupPayment from "./pages/SetupPayment.jsx";
import Organizations from "./pages/Organizations.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      {/* Admin routes live outside AppShell to avoid mixing nav/layout */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <RequireAdminAuth>
            <AdminShell />
          </RequireAdminAuth>
        }
      >
        <Route index element={<AdminHome />} />
      </Route>

      <Route element={<AppShell />}>
        <Route path="/" element={<Marketplace />} />
        <Route path="/products/:slug/plans" element={<Plans />} />

        {/* NEW: subscribe stub route */}
        <Route path="/subscribe/:productSlug/:planId" element={<Subscribe />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setup-payment" element={<SetupPayment />} />

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
