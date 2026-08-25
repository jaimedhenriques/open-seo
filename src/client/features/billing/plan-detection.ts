import {
  AUTUMN_PAID_PLAN_FEATURE_ID,
  isPaidPlanId,
  type PlanTier,
} from "@/shared/billing";

export type PlanStatus = "free" | "paid";

type CustomerLike = {
  flags?: Record<string, unknown>;
  subscriptions?: { planId?: string | null; status?: string | null }[];
};

export function getCustomerPlanStatus(
  customer: CustomerLike | undefined,
): PlanStatus {
  return customer?.flags?.[AUTUMN_PAID_PLAN_FEATURE_ID] ? "paid" : "free";
}

/**
 * Which paid tier the customer is on, or "free" when none is active.
 *
 * Reads the subscription rows rather than the `paid_plan` flag, because the
 * flag only says *whether* they pay, not *what for* — tier-gated UI (seat
 * counts, rank-check cadence, project limits) needs the specific plan.
 */
export function getCustomerPlanTier(
  customer: CustomerLike | undefined,
): PlanTier {
  // isPaidPlanId narrows planId to PlanTier, so the mapped ids need no cast.
  const paid = (customer?.subscriptions ?? []).flatMap((s) =>
    isPaidPlanId(s.planId) ? [{ planId: s.planId, status: s.status }] : [],
  );
  const current = paid.find((s) => s.status === "active") ?? paid[0];
  return current?.planId ?? "free";
}
