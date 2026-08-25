import { isPaidPlanId } from "@/shared/billing";

// The subset of the Autumn SDK's `Customer` we read. The SDK already validates
// and returns camelCase, so we type against it structurally instead of
// re-parsing; everything else is preserved verbatim in `customerJson`.
type AutumnSubscriptionInput = {
  planId?: string | null;
  status?: string | null;
};

type AutumnCustomerInput = {
  id?: string | null;
  subscriptions?: AutumnSubscriptionInput[];
  [key: string]: unknown;
};

export type BillingCustomerStatusSnapshot = {
  organizationId: string;
  isPaying: boolean;
  paidPlanId: string | null;
  paidPlanStatus: string | null;
  customerJson: string;
  syncedAt: string;
};

export function deriveBillingCustomerStatusSnapshot(
  customer: AutumnCustomerInput,
): BillingCustomerStatusSnapshot {
  const organizationId = customer.id;
  if (!organizationId) {
    throw new Error("Autumn customer is missing an id");
  }

  const subscription = selectPaidSubscription(customer.subscriptions ?? []);

  return {
    organizationId,
    isPaying: subscription?.status === "active",
    paidPlanId: subscription?.planId ?? null,
    paidPlanStatus: subscription?.status ?? null,
    // Full payload kept verbatim — query rarely-used fields via json_extract.
    customerJson: JSON.stringify(customer),
    syncedAt: new Date().toISOString(),
  };
}

// A customer is "paying" when they hold any paid tier. Prefer an active row,
// but fall back to any paid row so a not-yet-active plan still records its id.
//
// With several paid tiers a customer can briefly hold two rows at once (an
// active plan plus a scheduled upgrade or downgrade). Ordering by PLANS rank
// would pick the more expensive one; preferring the *active* row keeps the
// snapshot describing what they are entitled to right now, and the scheduled
// row takes over once Autumn activates it.
function selectPaidSubscription(subscriptions: AutumnSubscriptionInput[]) {
  const paid = subscriptions.filter((s) => isPaidPlanId(s.planId));
  return paid.find((s) => s.status === "active") ?? paid[0] ?? null;
}
