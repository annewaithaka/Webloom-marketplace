// =========================================
// FILE: webloom-marketplace-frontend/src/utils/formatMoney.js
// =========================================
export function formatKES(amount) {
  const n = Number(amount ?? 0);
  return `KES ${n.toLocaleString("en-KE")}`;
}
