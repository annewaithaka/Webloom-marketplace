import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

export async function getProducts() {
  const res = await axios.get(`${API_BASE_URL}/products`);
  return res.data.products || [];
}

export async function getPlansBySlug(slug) {
  const res = await axios.get(`${API_BASE_URL}/products/${slug}/plans`);
  return res.data;
}
