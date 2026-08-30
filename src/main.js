import { calculatePrice, getTaxPercent, parseAmount, PROVINCES } from "./calculator.js";

const RATE_URL = "https://open.er-api.com/v6/latest/CAD";
const RATE_CACHE_KEY = "taxconv-cad-eur-rate";

const cadFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  minimumFractionDigits: 2,
});

const eurFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

const amountInput = document.querySelector("#amount");
const provinceInputs = [...document.querySelectorAll('input[name="province"]')];
const taxInput = document.querySelector("#include-tax");
const restaurantInput = document.querySelector("#restaurant-mode");
const tipOption = document.querySelector("#tip-option");
const tipInput = document.querySelector("#tip-percent");
const restaurantDescription = document.querySelector("#restaurant-description");
const taxDescription = document.querySelector("#tax-description");
const provinceInfoTitle = document.querySelector("#province-info-title");
const provinceInfoText = document.querySelector("#province-info-text");
const resultAmount = document.querySelector("#result-amount");
const resultDetail = document.querySelector("#result-detail");
const resultTotal = document.querySelector("#result-total");
const rateStatus = document.querySelector("#rate-status");
const rateStatusText = document.querySelector("#rate-status-text");

let exchange = readCachedRate();
let rateError = false;

const PROVINCE_INFO = {
  BC: "Basic groceries are tax-free. Most meals, coffee, chips and candy have 5% GST only. Soda uses the regular 12% sales tax.",
  ON: "Basic groceries are tax-free. Most snacks, soda and meals use the regular 13% HST. Ontario’s rebate reduces the tax to 5% on qualifying prepared food and drinks totalling $4 or less.",
  QC: "Basic groceries are tax-free. Most snacks, soda and meals use the regular 14.975% sales tax. Some desserts, seasoned nuts and cereal bars have 5% GST only outside restaurants.",
};

function readCachedRate() {
  try {
    const cached = JSON.parse(localStorage.getItem(RATE_CACHE_KEY));
    return cached?.rate > 0 && Number.isFinite(cached.updatedAt) ? cached : null;
  } catch {
    return null;
  }
}

function selectedProvince() {
  const code = provinceInputs.find((input) => input.checked).value;
  return PROVINCES.find((province) => province.code === code);
}

function render() {
  const province = selectedProvince();
  const amount = parseAmount(amountInput.value);
  const isMeal = restaurantInput.checked;
  const taxPercent = taxInput.checked ? getTaxPercent(province, isMeal, amount) : 0;
  const tipPercent = isMeal ? Number(tipInput.value) : 0;
  const result = calculatePrice(amount, taxPercent, exchange?.rate, tipPercent);

  tipOption.hidden = !isMeal;
  const restaurantExtras = [taxInput.checked && "meal tax", tipPercent > 0 && `${tipPercent}% tip`].filter(Boolean);
  restaurantDescription.textContent = isMeal
    ? `On · ${restaurantExtras.join(" + ") || "no extras"}`
    : "Off · regular purchase";
  const taxName = isMeal && taxPercent === 5 ? (province.code === "ON" ? "Ontario rebate" : "GST") : province.taxName;
  taxDescription.textContent = taxInput.checked
    ? `${taxName} · ${taxPercent}%`
    : "No tax added";
  provinceInfoTitle.textContent = `Tax basics in ${province.name}`;
  provinceInfoText.textContent = PROVINCE_INFO[province.code];
  resultAmount.textContent = result.totalEur === null ? "—" : eurFormatter.format(result.totalEur);
  const extras = [
    result.tax > 0 && `${cadFormatter.format(result.tax)} tax`,
    result.tip > 0 && `${cadFormatter.format(result.tip)} tip`,
  ].filter(Boolean);
  resultDetail.textContent = extras.length
    ? `${cadFormatter.format(amount)} + ${extras.join(" + ")}`
    : "No tax or tip added";
  resultTotal.textContent = `Total: ${cadFormatter.format(result.totalCad)}`;

  rateStatus.classList.toggle("is-stale", rateError);
  if (exchange) {
    const date = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(exchange.updatedAt);
    rateStatusText.textContent =
      `1 CA$ = ${exchange.rate.toFixed(4)} € · updated ${date}${rateError ? " · offline rate" : ""}`;
  } else {
    rateStatusText.textContent = rateError
      ? "Exchange rate unavailable — check your connection"
      : "Fetching today’s exchange rate…";
  }
}

amountInput.addEventListener("input", render);
taxInput.addEventListener("change", render);
restaurantInput.addEventListener("change", render);
tipInput.addEventListener("change", render);
provinceInputs.forEach((input) => input.addEventListener("change", render));

fetch(RATE_URL)
  .then((response) => {
    if (!response.ok) throw new Error("Exchange-rate request failed");
    return response.json();
  })
  .then((data) => {
    const rate = data?.rates?.EUR;
    if (!Number.isFinite(rate) || rate <= 0) throw new Error("Invalid exchange rate");

    exchange = { rate, updatedAt: data.time_last_update_unix * 1000 || Date.now() };
    rateError = false;
    try {
      localStorage.setItem(RATE_CACHE_KEY, JSON.stringify(exchange));
    } catch {
      // The live rate still works when browser storage is unavailable.
    }
    render();
  })
  .catch(() => {
    rateError = true;
    render();
  });

render();
