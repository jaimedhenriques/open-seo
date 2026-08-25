import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCustomer } from "autumn-js/react";
import { useEffect, useState } from "react";
import { ArrowRight, Settings, User } from "lucide-react";
import { ThemePreferenceMenuItems } from "@/client/components/ThemePreferenceMenuItems";
import { captureClientEvent } from "@/client/lib/posthog";
import { signOutAndRedirect, useSession } from "@/lib/auth-client";
import { isHostedClientAuthMode } from "@/lib/auth-mode";
import { getStandardErrorMessage } from "@/client/lib/error-messages";
import { getSubscribeRouteState } from "@/client/features/billing/route-state";
import { getCustomerPlanStatus } from "@/client/features/billing/plan-detection";
import { normalizeAuthRedirect } from "@/lib/auth-redirect";
import {
  AUTUMN_MANAGED_ACCESS_FEATURE_ID,
  AUTUMN_SEO_DATA_CREDITS_PER_USD,
  DEFAULT_UPGRADE_PLAN_ID,
  PLANS,
  autumnProductId,
  type BillingPeriod,
  type PlanDefinition,
  type PlanTier,
} from "@/shared/billing";

const SUPPORT_EMAIL = "support@searchcrew.ai";

/** Selectable tiers, cheapest first. Free is the default, so it isn't offered. */
const PAID_PLANS = PLANS.filter((plan) => plan.monthlyUsd > 0);

const usdCredits = (credits: number) =>
  `$${(credits / AUTUMN_SEO_DATA_CREDITS_PER_USD).toFixed(0)}`;

function planFeatures(plan: PlanDefinition): string[] {
  return [
    `${usdCredits(plan.monthlyCredits)} of usage credits each month`,
    plan.projects === "unlimited"
      ? "Unlimited projects"
      : `${plan.projects} project${plan.projects === 1 ? "" : "s"}`,
    `${plan.seats} team seat${plan.seats === 1 ? "" : "s"}`,
    `${plan.rankCheckCadence === "daily" ? "Daily" : "Weekly"} rank tracking`,
    "Full MCP server and agent skills access",
    "Keyword research, backlinks, and site audits",
  ];
}

// How long the post-checkout "finalizing" screen polls Autumn before giving
// up and letting the user through anyway.
const FINALIZING_TIMEOUT_MS = 30_000;

export const Route = createFileRoute("/_authenticated/subscribe")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { upgrade?: true; redirect?: string; checkout?: "success" } => ({
    upgrade:
      search.upgrade === true || search.upgrade === "true" ? true : undefined,
    redirect:
      typeof search.redirect === "string"
        ? normalizeAuthRedirect(search.redirect)
        : undefined,
    checkout: search.checkout === "success" ? "success" : undefined,
  }),
  component: SubscribePage,
});

function SubscribePage() {
  const navigate = useNavigate();
  const { upgrade: isUpgradeFlow, redirect, checkout } = Route.useSearch();
  const { data: session } = useSession();
  const [isAttaching, setIsAttaching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<PlanTier>(
    DEFAULT_UPGRADE_PLAN_ID,
  );
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const [finalizingTimedOut, setFinalizingTimedOut] = useState(false);
  const checkoutCompleted = checkout === "success";

  const hasSession = Boolean(session?.user?.id);
  const customerQuery = useCustomer({
    queryOptions: {
      enabled: hasSession,
    },
  });

  // Read managed access from the already-loaded Autumn customer (local, no API
  // call) instead of a separate server round-trip. Self-hosted has no Autumn
  // customer, so mirror the server's "always granted" behavior there.
  const hasManagedAccess = isHostedClientAuthMode()
    ? customerQuery.check({ featureId: AUTUMN_MANAGED_ACCESS_FEATURE_ID })
        .allowed
    : true;

  const planStatus = getCustomerPlanStatus(customerQuery.data);
  const subscribeRouteState = getSubscribeRouteState({
    hasSession,
    isCustomerLoading: customerQuery.isLoading,
    isCustomerError: customerQuery.isError,
    hasManagedAccess,
    planStatus,
    isUpgradeFlow: isUpgradeFlow === true,
    checkoutCompleted,
    finalizingTimedOut,
  });

  // Autumn can lag Stripe by a few seconds after checkout; poll until the
  // subscription shows up so the just-paid user isn't shown the paywall again.
  const isFinalizing = subscribeRouteState === "finalizing";
  const { refetch: refetchCustomer } = customerQuery;
  useEffect(() => {
    if (!isFinalizing) return;
    const interval = setInterval(() => {
      void refetchCustomer();
    }, 2000);
    return () => clearInterval(interval);
  }, [refetchCustomer, isFinalizing]);

  // Armed once on landing with checkout=success (not on the finalizing state,
  // which a transient poll error can leave and re-enter) so the deadline is a
  // hard bound from arrival.
  useEffect(() => {
    if (!checkoutCompleted || finalizingTimedOut) return;
    const timeout = setTimeout(
      () => setFinalizingTimedOut(true),
      FINALIZING_TIMEOUT_MS,
    );
    return () => clearTimeout(timeout);
  }, [checkoutCompleted, finalizingTimedOut]);

  useEffect(() => {
    if (subscribeRouteState === "redirectToApp") {
      if (checkoutCompleted) {
        captureClientEvent("billing:checkout_success");
      }
      void navigate({ href: redirect ?? "/", replace: true });
    }
  }, [checkoutCompleted, navigate, redirect, subscribeRouteState]);

  useEffect(() => {
    if (subscribeRouteState === "showPaywall" && !isUpgradeFlow) {
      captureClientEvent("billing:paywall_viewed");
    }
  }, [isUpgradeFlow, subscribeRouteState]);

  if (
    subscribeRouteState === "loading" ||
    subscribeRouteState === "redirectToApp"
  ) {
    return null;
  }

  if (subscribeRouteState === "finalizing") {
    return (
      <div className="w-full max-w-xs space-y-4 text-center">
        <img
          src="/transparent-logo.png"
          alt="SearchCrew"
          className="mx-auto size-10 rounded-lg"
        />
        <h1 className="text-xl font-semibold">
          Finalizing your subscription&hellip;
        </h1>
        <span className="loading loading-spinner loading-md" />
        <p className="text-sm text-base-content/60">
          This usually takes a few seconds.
        </p>
        <p className="text-xs text-base-content/50">
          Taking longer?{" "}
          <a className="link" href={`mailto:${SUPPORT_EMAIL}`}>
            Email {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </div>
    );
  }

  if (subscribeRouteState === "error") {
    return (
      <div className="w-full max-w-xs space-y-4">
        <div className="text-center space-y-3">
          <img
            src="/transparent-logo.png"
            alt="SearchCrew"
            className="mx-auto size-10 rounded-lg"
          />
          <h1 className="text-xl font-semibold">Billing unavailable</h1>
        </div>

        <p className="text-sm text-center text-base-content/70">
          {getStandardErrorMessage(
            customerQuery.error,
            "We couldn't verify your billing status right now. Please try again.",
          )}
        </p>

        <button
          type="button"
          className="btn btn-soft w-full"
          onClick={() => {
            void customerQuery.refetch();
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  async function handleSubscribe() {
    setError(null);
    setIsAttaching(true);

    try {
      captureClientEvent("billing:checkout_start", {
        plan: selectedTier,
        period,
      });
      const successUrl = new URL(window.location.href);
      successUrl.searchParams.set("checkout", "success");
      await customerQuery.attach({
        planId: autumnProductId(selectedTier, period),
        redirectMode: "always",
        successUrl: successUrl.toString(),
      });
    } catch (err) {
      setError(
        getStandardErrorMessage(
          err,
          "We couldn't start the checkout. Please try again.",
        ),
      );
      setIsAttaching(false);
    }
  }

  const firstName = session?.user?.name?.split(" ")[0] || "";
  // PAID_PLANS is a non-empty literal, so the fallback is unreachable; it just
  // keeps the type non-optional without a non-null assertion.
  const selectedPlan =
    PAID_PLANS.find((plan) => plan.id === selectedTier) ?? PAID_PLANS[0];

  return (
    <div className="w-full max-w-sm space-y-6">
      <SubscribePageAccountMenu email={session?.user?.email} />

      <div className="text-center space-y-3">
        <img
          src="/transparent-logo.png"
          alt="SearchCrew"
          className="mx-auto size-10 rounded-lg"
        />
        <h1 className="text-xl font-semibold">
          {isUpgradeFlow
            ? "Upgrade your plan"
            : firstName
              ? `Welcome to SearchCrew, ${firstName}!`
              : "Welcome to SearchCrew!"}
        </h1>
        <p className="text-sm text-base-content/60">
          SEO on your terms. All your SEO tools in one place at a fair price.
        </p>
      </div>

      <div
        className="flex rounded-lg bg-base-200 p-1"
        role="radiogroup"
        aria-label="Billing period"
      >
        {(["monthly", "annual"] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={period === option}
            onClick={() => setPeriod(option)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              period === option
                ? "bg-base-100 text-base-content shadow-sm"
                : "text-base-content/60 hover:text-base-content"
            }`}
          >
            {option === "monthly" ? "Monthly" : "Annual"}
            {option === "annual" ? (
              <span className="ml-1.5 text-xs font-normal text-success">
                2 months free
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="space-y-2" role="radiogroup" aria-label="Plan">
        {PAID_PLANS.map((plan) => {
          const isSelected = plan.id === selectedTier;
          const priceUsd =
            period === "annual" ? plan.annualUsd / 12 : plan.monthlyUsd;

          return (
            <button
              key={plan.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelectedTier(plan.id)}
              className={`flex w-full items-baseline justify-between gap-4 rounded-lg border px-4 py-3 text-left transition-colors ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-base-300 hover:border-base-content/30"
              }`}
            >
              <span className="font-semibold">{plan.name}</span>
              <span className="text-sm text-base-content/60">
                <span className="text-base font-semibold tabular-nums text-base-content">
                  ${priceUsd % 1 === 0 ? priceUsd : priceUsd.toFixed(2)}
                </span>
                /mo
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-lg border border-base-300 p-5 space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-semibold">{selectedPlan.name}</span>
          <span className="text-lg font-semibold tabular-nums">
            {period === "annual"
              ? `$${selectedPlan.annualUsd}/year`
              : `$${selectedPlan.monthlyUsd}/month`}
          </span>
        </div>

        <ul className="space-y-2">
          {planFeatures(selectedPlan).map((item) => (
            <li
              key={item}
              className="flex gap-2.5 text-sm text-base-content/70"
            >
              <span className="text-base-content/40 mt-[2px] shrink-0">
                &mdash;
              </span>
              {item}
            </li>
          ))}
          {/* Sub-bullet of the Usage Credits line above. */}
          <li className="-mt-1 pl-6 text-xs">
            <a
              className="text-base-content/60 underline decoration-base-content/40 decoration-dotted underline-offset-4 transition-colors hover:text-base-content"
              href="https://searchcrew.ai/pricing"
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                captureClientEvent("billing:pricing_estimator_click")
              }
            >
              How far do usage credits go?{" "}
              <span aria-hidden="true">&#8599;</span>
            </a>
          </li>
        </ul>

        {error ? <p className="text-sm text-error">{error}</p> : null}

        <button
          className="btn btn-soft w-full"
          disabled={isAttaching}
          onClick={() => void handleSubscribe()}
        >
          {isAttaching ? "Redirecting..." : "Subscribe"}
        </button>

        <p className="text-center text-xs text-base-content/50">
          <span
            className="tooltip before:max-w-60 before:whitespace-normal"
            data-tip={`Not for you yet? Email ${SUPPORT_EMAIL} within 30 days of your charge and we'll refund your subscription.`}
          >
            <span className="cursor-help underline decoration-dotted">
              30-day money-back guarantee
            </span>
          </span>
          . Cancel anytime. Powered by Stripe.
        </p>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-base-content/60">
          Questions? Email {SUPPORT_EMAIL}.
        </p>
        {isUpgradeFlow ? (
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-base-content/70 hover:text-base-content transition-colors"
            onClick={() => void navigate({ to: "/", replace: true })}
          >
            <ArrowRight className="size-3.5 rotate-180" />
            Back to app
          </button>
        ) : null}
      </div>
    </div>
  );
}

function SubscribePageAccountMenu({ email }: { email: string | undefined }) {
  if (!email) return null;

  const handleSignOut = () => signOutAndRedirect();

  return (
    <div className="fixed top-4 right-4">
      <div className="dropdown dropdown-end">
        <button
          type="button"
          tabIndex={0}
          className="btn btn-ghost btn-circle"
          aria-label="Open account menu"
        >
          <User className="h-5 w-5" />
        </button>
        <ul
          tabIndex={0}
          className="dropdown-content z-20 menu mt-3 min-w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
        >
          <li className="menu-title max-w-full">
            <span className="truncate text-base-content" data-ph-mask>
              {email}
            </span>
          </li>
          <li>
            <Link to="/settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </li>
          <ThemePreferenceMenuItems />
          <li>
            <button
              type="button"
              className="text-error"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
