import { Routes, Route } from "react-router-dom";
import Marketplace from "../pages/Marketplace";
import ProductPlans from "../pages/ProductPlans";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Marketplace />} />
      <Route path="/products/:slug/plans" element={<ProductPlans />} />
    </Routes>
  );
}
