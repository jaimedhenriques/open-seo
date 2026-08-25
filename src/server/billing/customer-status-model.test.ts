import { describe, expect, it } from "vitest";
import { DEFAULT_UPGRADE_PLAN_ID, PAID_PLAN_IDS } from "@/shared/billing";
import { deriveBillingCustomerStatusSnapshot } from "./customer-status-model";

describe("deriveBillingCustomerStatusSnapshot", () => {
  it("marks customers with an active paid subscription as paying", () => {
    const snapshot = deriveBillingCustomerStatusSnapshot({
      id: "org_123",
      subscriptions: [{ planId: DEFAULT_UPGRADE_PLAN_ID, status: "active" }],
    });

    expect(snapshot).toMatchObject({
      organizationId: "org_123",
      isPaying: true,
      paidPlanId: DEFAULT_UPGRADE_PLAN_ID,
      paidPlanStatus: "active",
    });
  });

  it("recognizes every paid tier, not just the default upgrade plan", () => {
    for (const planId of PAID_PLAN_IDS) {
      const snapshot = deriveBillingCustomerStatusSnapshot({
        id: "org_123",
        subscriptions: [{ planId, status: "active" }],
      });

      expect(snapshot).toMatchObject({ isPaying: true, paidPlanId: planId });
    }
  });

  it("preserves the full customer payload in customerJson", () => {
    const snapshot = deriveBillingCustomerStatusSnapshot({
      id: "org_123",
      email: "alice@example.com",
      stripeId: "cus_123",
      subscriptions: [{ planId: DEFAULT_UPGRADE_PLAN_ID, status: "active" }],
    });

    expect(JSON.parse(snapshot.customerJson)).toMatchObject({
      id: "org_123",
      email: "alice@example.com",
      stripeId: "cus_123",
    });
  });

  it("keeps non-paid customers queryable but not paying", () => {
    const snapshot = deriveBillingCustomerStatusSnapshot({
      id: "org_123",
      subscriptions: [{ planId: "free", status: "active" }],
    });

    expect(snapshot.isPaying).toBe(false);
    expect(snapshot.paidPlanId).toBeNull();
    expect(snapshot.paidPlanStatus).toBeNull();
  });

  it("records a scheduled (not-yet-active) paid plan as not paying", () => {
    const snapshot = deriveBillingCustomerStatusSnapshot({
      id: "org_456",
      subscriptions: [{ planId: DEFAULT_UPGRADE_PLAN_ID, status: "scheduled" }],
    });

    expect(snapshot).toMatchObject({
      organizationId: "org_456",
      isPaying: false,
      paidPlanId: DEFAULT_UPGRADE_PLAN_ID,
      paidPlanStatus: "scheduled",
    });
  });

  it("prefers an active paid subscription when multiple paid rows exist", () => {
    const snapshot = deriveBillingCustomerStatusSnapshot({
      id: "org_789",
      subscriptions: [
        { planId: DEFAULT_UPGRADE_PLAN_ID, status: "scheduled" },
        { planId: DEFAULT_UPGRADE_PLAN_ID, status: "active" },
      ],
    });

    expect(snapshot.isPaying).toBe(true);
    expect(snapshot.paidPlanId).toBe(DEFAULT_UPGRADE_PLAN_ID);
    expect(snapshot.paidPlanStatus).toBe("active");
  });
});
