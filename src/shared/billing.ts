export const BILLING_ROUTE = "/billing";
export const SUBSCRIBE_ROUTE = "/subscribe";

export const AUTUMN_SEO_DATA_TOP_UP_PLAN_ID = "credit-top-up";
export const AUTUMN_PAID_PLAN_FEATURE_ID = "paid_plan";
// Granted by both the free plan (now the Autumn Default, so every non-paid
// user gets it) and the paid base plan. It's the floor for using the managed
// service at all — paid-only features gate on AUTUMN_PAID_PLAN_FEATURE_ID.
export const AUTUMN_MANAGED_ACCESS_FEATURE_ID = "managed_service_access";
// The shared usage-credit pool. Both DataForSEO and onboarding-LLM spend deduct
// from these (monthly usage_credits first, then rolled-over topup_credits).
export const AUTUMN_SEO_DATA_BALANCE_FEATURE_ID = "usage_credits";
export const AUTUMN_SEO_DATA_TOPUP_BALANCE_FEATURE_ID = "topup_credits";
export const AUTUMN_SEO_DATA_CREDITS_PER_USD = 1000;
export const SEO_DATA_COST_MARKUP = 1.28;
export const LOW_CREDITS_THRESHOLD_USD = 0.25;

/* ------------------------------------------------------------------ *
 * PLAN LINEUP — the single source of truth for tiers.
 *
 * `id` must match the Autumn product id exactly. Autumn owns the actual
 * prices and credit grants; the numbers here drive marketing copy, in-app
 * plan comparison, and upgrade prompts, so they must be kept in step with
 * the Autumn dashboard.
 *
 * Credit accounting is unchanged: 1,000 credits = $1.00 billed, which is
 * ~$0.781 of raw DataForSEO spend at SEO_DATA_COST_MARKUP.
 * ------------------------------------------------------------------ */
export type PlanTier = "free" | "solo" | "pro" | "agency";
export type BillingPeriod = "monthly" | "annual";

/**
 * Autumn product id for a tier on a given billing period. Each paid tier needs
 * BOTH products to exist in the Autumn dashboard — `solo` and `solo-annual`,
 * and so on — or checkout for that period will fail.
 */
export function autumnProductId(tier: PlanTier, period: BillingPeriod): string {
  return period === "annual" ? `${tier}-annual` : tier;
}

export type PlanDefinition = {
  id: PlanTier;
  name: string;
  /** Month-to-month price in USD. */
  monthlyUsd: number;
  /** Total charged for 12 months up front (2 months free). 0 for Free. */
  annualUsd: number;
  /** Usage credits granted each month. Reset monthly; top-ups roll over. */
  monthlyCredits: number;
  projects: number | "unlimited";
  seats: number;
  /** Highest rank-check cadence the tier allows. */
  rankCheckCadence: "manual" | "weekly" | "daily";
};

export const PLANS: readonly PlanDefinition[] = [
  {
    id: "free",
    name: "Free",
    monthlyUsd: 0,
    annualUsd: 0,
    monthlyCredits: 2_000,
    projects: 1,
    seats: 1,
    rankCheckCadence: "manual",
  },
  {
    id: "solo",
    name: "Solo",
    monthlyUsd: 29,
    annualUsd: 290,
    monthlyCredits: 20_000,
    projects: 3,
    seats: 1,
    rankCheckCadence: "weekly",
  },
  {
    id: "pro",
    name: "Pro",
    monthlyUsd: 79,
    annualUsd: 790,
    monthlyCredits: 60_000,
    projects: "unlimited",
    seats: 3,
    rankCheckCadence: "daily",
  },
  {
    id: "agency",
    name: "Agency",
    monthlyUsd: 199,
    annualUsd: 1_990,
    monthlyCredits: 140_000,
    projects: "unlimited",
    seats: 10,
    rankCheckCadence: "daily",
  },
] as const;

/** Every tier that requires a subscription. Free is granted by default. */
export const PAID_PLAN_IDS: readonly PlanTier[] = PLANS.filter(
  (plan) => plan.monthlyUsd > 0,
).map((plan) => plan.id);

/**
 * The tier a generic "Upgrade" call to action checks out into, used where the
 * UI has no tier picker of its own (in-app upgrade nudges, the onboarding
 * paywall). The subscribe page lets the customer pick any tier instead.
 */
export const DEFAULT_UPGRADE_PLAN_ID: PlanTier = "pro";

export function isPaidPlanId(
  planId: string | null | undefined,
): planId is PlanTier {
  return PAID_PLAN_IDS.some((id) => id === planId);
}

export function getPlan(planId: string | null | undefined) {
  return PLANS.find((plan) => plan.id === planId);
}

export function roundUsdForBilling(value: number) {
  return Math.round(value * 100000) / 100000;
}

export function autumnSeoDataCreditsToUsd(credits: number) {
  return credits / AUTUMN_SEO_DATA_CREDITS_PER_USD;
}

/**
 * Convert a raw DataForSEO USD cost into the USD amount a hosted customer is
 * actually billed, applying the platform markup. Use this when displaying
 * cost estimates so the number matches what the user will be charged.
 *
 * Self-hosted deployments pay DataForSEO directly at the raw rate and should
 * show the raw number — gate at the call site with `isHostedClientAuthMode`.
 */
export function applyBillingMarkupUsd(rawUsd: number): number {
  return roundUsdForBilling(rawUsd * SEO_DATA_COST_MARKUP);
}
