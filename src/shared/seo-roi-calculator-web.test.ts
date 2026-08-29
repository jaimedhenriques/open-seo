import { describe, expect, it } from "vitest";
import {
  DEFAULT_SEO_ROI_INPUTS,
  calculateSeoRoi,
  formatSeoRoiDisplayCurrency,
  formatSeoRoiNumber,
  sanitizeSeoRoiInputs,
} from "../../web/src/lib/seo-roi-calculator";

describe("SEO ROI calculator", () => {
  it("calculates the documented default scenario", () => {
    expect(calculateSeoRoi(DEFAULT_SEO_ROI_INPUTS)).toEqual({
      monthlyLeads: 125,
      monthlyCustomers: 12.5,
      monthlyGrossProfit: 12_500,
      monthlyNetImpact: 9_500,
      yearOneNetImpact: 109_000,
      yearOneRoi: 109_000 / 41_000,
      paybackMonths: 5_000 / 9_500,
    });
  });

  it.each([
    { monthlyOrganicVisits: 0 },
    { visitorToLeadRate: 0 },
    { leadToCustomerRate: 0 },
  ])("does not claim payback when conversion stops", (override) => {
    const result = calculateSeoRoi({
      ...DEFAULT_SEO_ROI_INPUTS,
      ...override,
    });

    expect(result.paybackMonths).toBeNull();
    expect(result.monthlyGrossProfit).toBe(0);
    expect(
      Object.values(result).every(
        (value) => value === null || Number.isFinite(value),
      ),
    ).toBe(true);
  });

  it("reports immediate payback when setup cost is zero", () => {
    expect(
      calculateSeoRoi({
        ...DEFAULT_SEO_ROI_INPUTS,
        oneTimeSetupCost: 0,
      }).paybackMonths,
    ).toBe(0);
  });

  it("does not invent a setup-cost payback period when setup is free and monthly impact is non-positive", () => {
    const result = calculateSeoRoi({
      ...DEFAULT_SEO_ROI_INPUTS,
      monthlyOrganicVisits: 0,
      oneTimeSetupCost: 0,
    });

    expect(result.monthlyNetImpact).toBeLessThan(0);
    expect(result.paybackMonths).toBe(0);
  });

  it("keeps meaningful decimal values in the displayed forecast", () => {
    expect(formatSeoRoiNumber(12.5)).toBe("12.5");
    expect(formatSeoRoiNumber(125)).toBe("125");
  });

  it("compacts large currency outputs for narrow screens", () => {
    expect(formatSeoRoiDisplayCurrency(599_998_550_000, "USD")).toBe("$600B");
    expect(formatSeoRoiDisplayCurrency(109_000, "USD")).toBe("$109,000");
  });

  it("keeps a negative-return scenario finite", () => {
    const result = calculateSeoRoi({
      ...DEFAULT_SEO_ROI_INPUTS,
      monthlyOrganicVisits: 100,
      monthlySeoSpend: 10_000,
    });

    expect(result.monthlyNetImpact).toBeLessThan(0);
    expect(result.yearOneNetImpact).toBeLessThan(0);
    expect(result.paybackMonths).toBeNull();
    expect(result.yearOneRoi).not.toBeNull();
  });

  it("clamps out-of-range values and replaces non-finite input", () => {
    expect(
      sanitizeSeoRoiInputs({
        ...DEFAULT_SEO_ROI_INPUTS,
        monthlyOrganicVisits: -50,
        visitorToLeadRate: 250,
        leadToCustomerRate: Number.NaN,
      }),
    ).toEqual({
      ...DEFAULT_SEO_ROI_INPUTS,
      monthlyOrganicVisits: 0,
      visitorToLeadRate: 50,
    });
  });
});
