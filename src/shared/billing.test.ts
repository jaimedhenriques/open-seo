import { describe, expect, it } from "vitest";
import { PAID_PLAN_IDS, autumnProductId } from "./billing";

// These strings are a contract with the Autumn dashboard, not an internal
// detail: `attach` sends them as product ids. Renaming a tier in PLANS without
// renaming the product in Autumn produces a checkout that fails at the payment
// step, which is invisible until a customer tries to pay. Pinning them makes
// that rename a deliberate, reviewable change.
describe("Autumn product ids", () => {
  it("matches the products configured in Autumn", () => {
    const ids = PAID_PLAN_IDS.flatMap((tier) => [
      autumnProductId(tier, "monthly"),
      autumnProductId(tier, "annual"),
    ]);

    expect(ids).toEqual([
      "solo",
      "solo-annual",
      "pro",
      "pro-annual",
      "agency",
      "agency-annual",
    ]);
  });
});

describe("hosted SKU lock", () => {
  it("does not sell a $10 hosted SKU", async () => {
    const { PLANS } = await import("./billing");
    expect(PLANS.some((plan) => plan.monthlyUsd === 10)).toBe(false);
    expect(PLANS.filter((plan) => plan.monthlyUsd > 0).map((plan) => plan.monthlyUsd)).toEqual([29, 79, 199]);
  });
});

describe("LICENSE upstream notice", () => {
  it("keeps the OpenSEO MIT notice", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const license = readFileSync(resolve(process.cwd(), "LICENSE"), "utf8");
    expect(license).toContain("Copyright (c) 2026 Ben Senescu");
    expect(license).toContain("MIT License");
    expect(license).toContain("SearchCrew is a derivative work of OpenSEO");
  });
});
