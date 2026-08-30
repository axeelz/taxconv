import test from "node:test";
import assert from "node:assert/strict";
import { calculatePrice, getTaxPercent, parseAmount, PROVINCES } from "./calculator.js";

test("uses the verified general and meal sales-tax rates", () => {
  assert.deepEqual(
    Object.fromEntries(PROVINCES.map(({ code, taxPercent, mealTaxPercent }) => [code, [taxPercent, mealTaxPercent]])),
    { BC: [12, 5], ON: [13, 13], QC: [14.975, 14.975] },
  );

  const ontario = PROVINCES.find(({ code }) => code === "ON");
  assert.equal(getTaxPercent(ontario, true, 4), 5);
  assert.equal(getTaxPercent(ontario, true, 4.01), 13);
});

test("calculates tax and conversion without compounding Quebec taxes or tips", () => {
  const result = calculatePrice(100, 14.975, 0.65);

  assert.equal(result.tax, 14.975);
  assert.equal(result.tip, 0);
  assert.equal(result.totalCad, 114.975);
  assert.ok(Math.abs(result.totalEur - 74.73375) < Number.EPSILON);
});

test("adds an optional tip to the pre-tax amount", () => {
  const result = calculatePrice(100, 13, 0.65, 18);

  assert.equal(result.tax, 13);
  assert.equal(result.tip, 18);
  assert.equal(result.totalCad, 131);
  assert.equal(result.totalEur, 85.15);
});

test("accepts comma decimals and rejects negative or invalid prices", () => {
  assert.equal(parseAmount("12,50"), 12.5);
  assert.equal(parseAmount("-1"), 0);
  assert.equal(parseAmount("hello"), 0);
});
