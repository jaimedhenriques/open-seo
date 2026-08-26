import { describe, expect, it } from "vitest";
import { buildAutumnFeatures, buildAutumnProducts } from "./autumn-catalog";

describe("Autumn catalogue", () => {
  it("defines the feature contracts used by runtime billing gates", () => {
    expect(buildAutumnFeatures()).toEqual([
      { id: "paid_plan", name: "Paid Plan", type: "boolean" },
      {
        id: "managed_service_access",
        name: "Managed Service Access",
        type: "boolean",
      },
      {
        id: "usage_credits",
        name: "Usage Credits",
        type: "metered",
        consumable: true,
      },
      {
        id: "topup_credits",
        name: "Top-up Credits",
        type: "metered",
        consumable: true,
      },
    ]);
  });

  it("builds every tier, price, and credit grant the checkout flow expects", () => {
    expect(buildAutumnProducts()).toEqual([
      {
        id: "free",
        name: "Free",
        auto_enable: true,
        items: [
          { feature_id: "managed_service_access" },
          {
            feature_id: "usage_credits",
            included: 2_000,
            reset: { interval: "month" },
          },
        ],
      },
      {
        id: "solo",
        name: "Solo",
        price: { amount: 29, interval: "month" },
        items: [
          { feature_id: "paid_plan" },
          { feature_id: "managed_service_access" },
          {
            feature_id: "usage_credits",
            included: 20_000,
            reset: { interval: "month" },
          },
        ],
      },
      {
        id: "solo-annual",
        name: "Solo (Annual)",
        price: { amount: 290, interval: "year" },
        items: [
          { feature_id: "paid_plan" },
          { feature_id: "managed_service_access" },
          {
            feature_id: "usage_credits",
            included: 20_000,
            reset: { interval: "month" },
          },
        ],
      },
      {
        id: "pro",
        name: "Pro",
        price: { amount: 79, interval: "month" },
        items: [
          { feature_id: "paid_plan" },
          { feature_id: "managed_service_access" },
          {
            feature_id: "usage_credits",
            included: 60_000,
            reset: { interval: "month" },
          },
        ],
      },
      {
        id: "pro-annual",
        name: "Pro (Annual)",
        price: { amount: 790, interval: "year" },
        items: [
          { feature_id: "paid_plan" },
          { feature_id: "managed_service_access" },
          {
            feature_id: "usage_credits",
            included: 60_000,
            reset: { interval: "month" },
          },
        ],
      },
      {
        id: "agency",
        name: "Agency",
        price: { amount: 199, interval: "month" },
        items: [
          { feature_id: "paid_plan" },
          { feature_id: "managed_service_access" },
          {
            feature_id: "usage_credits",
            included: 140_000,
            reset: { interval: "month" },
          },
        ],
      },
      {
        id: "agency-annual",
        name: "Agency (Annual)",
        price: { amount: 1_990, interval: "year" },
        items: [
          { feature_id: "paid_plan" },
          { feature_id: "managed_service_access" },
          {
            feature_id: "usage_credits",
            included: 140_000,
            reset: { interval: "month" },
          },
        ],
      },
      {
        id: "credit-top-up",
        name: "Credit Top-up",
        add_on: true,
        items: [
          {
            feature_id: "topup_credits",
            price: {
              amount: 1,
              interval: "one_off",
              billing_method: "prepaid",
              billing_units: 1_000,
            },
          },
        ],
      },
    ]);
  });
});
