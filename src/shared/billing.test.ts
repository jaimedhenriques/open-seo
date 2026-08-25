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
