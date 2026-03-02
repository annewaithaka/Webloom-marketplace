// frontend/src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Marketplace from "../pages/Marketplace";
import ProductPlans from "../pages/ProductPlans";
import Subscribe from "../pages/Subscribe";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Marketplace />} />
      <Route path="/products/:slug/plans" element={<ProductPlans />} />
      <Route path="/subscribe/:productSlug/:planId" element={<Subscribe />} />
    </Routes>
  );
}
