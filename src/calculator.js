export const PROVINCES = [
  { code: "BC", name: "British Columbia", taxName: "GST + PST", taxPercent: 12, mealTaxPercent: 5 },
  { code: "ON", name: "Ontario", taxName: "HST", taxPercent: 13, mealTaxPercent: 13 },
  { code: "QC", name: "Quebec", taxName: "GST + QST", taxPercent: 14.975, mealTaxPercent: 14.975 },
];

export function getTaxPercent(province, isMeal, amount) {
  if (!isMeal) return province.taxPercent;
  return province.code === "ON" && amount <= 4 ? 5 : province.mealTaxPercent;
}

export function parseAmount(value) {
  const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
  const amount = Number(normalized);
  return Number.isFinite(amount) && amount >= 0 ? amount : 0;
}

export function calculatePrice(amount, taxPercent, exchangeRate, tipPercent = 0) {
  const tax = amount * (taxPercent / 100);
  const tip = amount * (tipPercent / 100);
  const totalCad = amount + tax + tip;

  return {
    tax,
    tip,
    totalCad,
    totalEur: exchangeRate ? totalCad * exchangeRate : null,
  };
}
