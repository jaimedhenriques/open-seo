import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type CSSProperties } from "react";
import { buildPageSeo } from "@/lib/seo";

export const Route = createFileRoute("/_marketing/pricing")({
  head: () =>
    buildPageSeo({
      title: "Pricing estimator",
      description:
        "Preview SearchCrew's planned hosted pricing and estimate monthly usage before public signup and billing open.",
      path: "/pricing",
      titleSuffix: "SearchCrew",
    }),
  component: Pricing,
});

/* ------------------------------------------------------------------ *
 * COST MODEL — edit everything pricing-related here.
 * Verified against the app call paths and live DataForSEO prices (Jul 2026).
 * Keep the math consistent with src/shared/billing.ts:
 *   billedUsd = roundTo5Decimals(rawDataForSeoCostUsd * MARKUP)
 *   creditsCharged = ceil(billedUsd * 1000)
 *   1 credit = $0.001  (1,000 credits = $1.00)
 * ------------------------------------------------------------------ */
const MARKUP = 1.28; // SearchCrew's flat 28% premium over raw DataForSEO cost
const CREDIT_USD = 0.001; // $ value of a single credit
/* Tier lineup. `web` is a separate workspace and cannot import the app's
 * src/shared/billing.ts, so this mirrors PLANS there — keep the two in step,
 * same as the cost model above. Prices are monthly; annual is 2 months free. */
const TIERS = [
  {
    id: "free",
    name: "Free",
    priceUsd: 0,
    annualUsd: 0,
    includedUsageUsd: 2,
    projects: "1 project",
    seats: "1 seat",
    cadence: "Manual rank checks",
  },
  {
    id: "solo",
    name: "Solo",
    priceUsd: 29,
    annualUsd: 290,
    includedUsageUsd: 20,
    projects: "3 projects",
    seats: "1 seat",
    cadence: "Weekly rank checks",
  },
  {
    id: "pro",
    name: "Pro",
    priceUsd: 79,
    annualUsd: 790,
    includedUsageUsd: 60,
    projects: "Unlimited projects",
    seats: "3 seats",
    cadence: "Daily rank checks",
  },
  {
    id: "agency",
    name: "Agency",
    priceUsd: 199,
    annualUsd: 1990,
    includedUsageUsd: 140,
    projects: "Unlimited projects",
    seats: "10 seats",
    cadence: "Daily rank checks",
  },
] as const;

/* Competitor list prices, read off semrush.com/prices and ahrefs.com/pricing.
 * Every row must stay checkable against those two pages — re-verify and move
 * COMPARISON_CHECKED forward whenever they restructure, which Semrush did
 * between the Pro/Guru/Business lineup and the current one. */
const COMPARISON_CHECKED = "August 2026";
const COMPARISON = [
  {
    label: "Cheapest plan with full API and MCP access",
    searchcrew: "$0 — Free, and every plan above it",
    semrush: "$549/mo — Advanced",
    ahrefs: "$129/mo — Lite",
  },
  {
    label: "Entry paid plan",
    searchcrew: "$29/mo — Solo",
    semrush: "$139/mo — SEO",
    ahrefs: "$29/mo — Starter",
  },
  {
    label: "Top plan before enterprise sales",
    searchcrew: "$199/mo — Agency",
    semrush: "$549/mo — Advanced",
    ahrefs: "$449/mo — Advanced",
  },
] as const;

const PERIODS = [
  { id: "monthly", label: "Monthly" },
  { id: "annual", label: "Annual" },
] as const;

/** Cheapest tier whose included usage covers the estimate, or the largest. */
function recommendTier(usageUsd: number) {
  return (
    TIERS.find((tier) => usageUsd <= tier.includedUsageUsd) ??
    TIERS[TIERS.length - 1]
  );
}
const WEEKS_PER_MONTH = 4.345; // 52 / 12
const DEFAULT_RANK_DEPTH = 40;
const DEFAULT_LOCAL_SERP_DEPTH = 20;
const BACKLINK_HISTORY_DAYS = 365;
const RANK_CHECK_OPTIONS = [0, 1, 7] as const;
const RANK_CHECK_LABELS: Record<number, string> = {
  0: "Manual",
  1: "Weekly",
  7: "Daily",
};

// Raw DataForSEO per-call cost in USD (NOT including SearchCrew's markup).
const RAW_COST_USD = {
  // Scheduled checks use the queued API. The app defaults to one device and
  // the top 40 results: $0.0006 for page one + $0.00045 per extra page.
  rankCheck: 0.0006 + (DEFAULT_RANK_DEPTH / 10 - 1) * 0.00045,
  // A 150–300 result Labs search is currently $0.030–$0.048 raw. Use the
  // midpoint so the customer estimate is a memorable $0.05 per search.
  keywordLabs: 0.039,
  // The MCP-only local SERP tool defaults to a live Google Maps/Local Finder
  // request with 20 results: $0.002 for page one + $0.0015 for page two.
  localSerp: 0.002 + (DEFAULT_LOCAL_SERP_DEPTH / 10 - 1) * 0.0015,
  // A domain overview loads a summary plus one year of daily history. Current
  // Backlinks API pricing is $0.024/request + $0.000036/result for each call.
  backlinkProfile:
    0.024 + 0.000036 + (0.024 + BACKLINK_HISTORY_DAYS * 0.000036),
  aiCitationPerPlatform: 0.85, // AI-citation / brand scan, per platform (biggest driver)
} as const;

/** creditsCharged for a single action, per the billing formula. */
function creditsForRaw(rawUsd: number): number {
  const billedUsd = Math.round(rawUsd * MARKUP * 100_000) / 100_000;
  return Math.ceil(billedUsd * 1000);
}

// Credits charged per unit of each action (computed once from the model above).
const CREDITS_PER_UNIT = {
  keywordLabs: creditsForRaw(RAW_COST_USD.keywordLabs), // 50
  localSerp: creditsForRaw(RAW_COST_USD.localSerp), // 5
  backlinkProfile: creditsForRaw(RAW_COST_USD.backlinkProfile), // 79
  aiCitation: creditsForRaw(RAW_COST_USD.aiCitationPerPlatform), // 1088
} as const;

/* ------------------------------------------------------------------ *
 * Personas — preset the estimator to the two modeled customers.
 * ------------------------------------------------------------------ */
type Inputs = {
  sites: number;
  keywordsPerSite: number;
  checksPerWeek: number;
  keywordRuns: number; // keyword-research runs / month
  localSerps: number; // MCP-only Google Maps / Local Finder SERPs per month
  backlinks: number; // backlink profile lookups / month
  aiScans: number; // AI-citation scans / month (per platform)
};

const PRESETS: Record<"business" | "freelancer", Inputs> = {
  // About $8/mo of usage: one site with weekly rank tracking and regular research.
  business: {
    sites: 1,
    keywordsPerSite: 50,
    checksPerWeek: 1,
    keywordRuns: 100,
    localSerps: 0,
    backlinks: 20,
    aiScans: 0,
  },
  // About $25/mo of usage: an agency checking 15 client sites weekly.
  freelancer: {
    sites: 15,
    keywordsPerSite: 20,
    checksPerWeek: 1,
    keywordRuns: 370,
    localSerps: 200,
    backlinks: 30,
    aiScans: 0,
  },
};

const usd = (n: number) =>
  n >= 100 ? `$${Math.round(n).toLocaleString()}` : `$${n.toFixed(2)}`;

function Pricing() {
  const [persona, setPersona] = useState<"business" | "freelancer">("business");
  const [period, setPeriod] = useState<"monthly" | "annual">("monthly");
  const [inputs, setInputs] = useState<Inputs>(PRESETS.business);

  function applyPersona(next: "business" | "freelancer") {
    setPersona(next);
    setInputs(PRESETS[next]);
  }

  function set<K extends keyof Inputs>(key: K, value: number) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  const estimate = useMemo(() => {
    const scheduledRunsPerMonth =
      inputs.sites * inputs.checksPerWeek * WEEKS_PER_MONTH;
    const rankChecksPerMonth = Math.round(
      scheduledRunsPerMonth * inputs.keywordsPerSite,
    );

    const lines = [
      {
        key: "keywords",
        label: "Keyword research",
        detail: `${inputs.keywordRuns.toLocaleString()} searches this month`,
        credits: inputs.keywordRuns * CREDITS_PER_UNIT.keywordLabs,
      },
      {
        key: "backlinks",
        label: "Backlink checks",
        detail: `${inputs.backlinks.toLocaleString()} checks this month`,
        credits: inputs.backlinks * CREDITS_PER_UNIT.backlinkProfile,
      },
      {
        key: "ai",
        label: "ChatGPT brand checks",
        detail: `${inputs.aiScans.toLocaleString()} checks this month`,
        credits: inputs.aiScans * CREDITS_PER_UNIT.aiCitation,
      },
      ...(persona === "freelancer"
        ? [
            {
              key: "local-serp",
              label: "Local SERP checks",
              detail: `${inputs.localSerps.toLocaleString()} checks this month`,
              credits: inputs.localSerps * CREDITS_PER_UNIT.localSerp,
            },
          ]
        : []),
      {
        key: "rank",
        label: "Rank tracking",
        detail: `${rankChecksPerMonth.toLocaleString()} checks this month`,
        // The app bills each site's scheduled run as one keyword batch.
        credits: Math.round(
          scheduledRunsPerMonth *
            creditsForRaw(inputs.keywordsPerSite * RAW_COST_USD.rankCheck),
        ),
      },
    ];

    const totalCredits = lines.reduce((sum, l) => sum + l.credits, 0);
    const usageUsd = totalCredits * CREDIT_USD;
    const tier = recommendTier(usageUsd);
    // Usage beyond the recommended tier's allowance is bought as top-ups,
    // which are billed at the same rate and never expire.
    const topUpUsd = Math.max(0, usageUsd - tier.includedUsageUsd);
    const billUsd = tier.priceUsd + topUpUsd;

    return {
      lines,
      usageUsd,
      tier,
      includedInBase: topUpUsd === 0,
      topUpUsd,
      billUsd,
    };
  }, [inputs, persona]);

  return (
    <article className="mx-auto max-w-4xl">
      {/* 1. Hero */}
      <p className="text-sm font-medium text-[var(--color-brand-accent)]">
        Pricing
      </p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-neutral-950 md:text-5xl">
        Planned hosted pricing
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-brand-muted)]">
        Every proposed SearchCrew plan includes the full MCP server and agent
        skills. Move the sliders to model your own usage before billing opens.
      </p>
      <div className="mt-6 max-w-2xl rounded-xl border border-[var(--color-brand-accent)]/40 bg-white p-4 text-sm leading-6 text-neutral-700">
        <p className="font-semibold text-neutral-950">
          Public signup and payment are paused.
        </p>
        <p className="mt-1">
          Use these tiers for planning while production auth, support, legal,
          and billing checks are completed.
        </p>
      </div>

      {/* 2. Tier lineup */}
      <section className="mt-10">
        <div className="flex flex-wrap items-center gap-3">
          <div
            role="group"
            aria-label="Billing period"
            className="inline-flex rounded-full border border-[var(--color-border-subtle)] bg-white p-1"
          >
            {PERIODS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setPeriod(option.id)}
                aria-pressed={period === option.id}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  period === option.id
                    ? "bg-neutral-950 text-white"
                    : "text-[var(--color-brand-muted)] hover:text-neutral-950"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-[var(--color-brand-muted)]">
            Annual billing is two months free on every paid plan.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-xl border p-5 ${
                tier.id === "solo"
                  ? "border-[var(--color-brand-accent)] bg-white"
                  : "border-[var(--color-border-subtle)]"
              }`}
            >
              {/* Fixed height, and the badge never wraps: the four cards share
               * one grid row, so a taller header here misaligns the others. */}
              <div className="flex h-6 items-center justify-between gap-2">
                <p className="font-semibold text-neutral-950">{tier.name}</p>
                {tier.id === "solo" ? (
                  <span className="shrink-0 whitespace-nowrap rounded-full bg-[var(--color-brand-accent)] px-2 py-1 text-[11px] font-semibold leading-none text-neutral-950">
                    Recommended
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-neutral-950">
                $
                {(period === "annual"
                  ? tier.annualUsd
                  : tier.priceUsd
                ).toLocaleString("en-US")}
                <span className="text-sm font-normal text-[var(--color-brand-muted)]">
                  {period === "annual" ? "/yr" : "/mo"}
                </span>
              </p>
              <p className="mt-1 h-5 text-xs text-[var(--color-brand-muted)]">
                {period === "annual" && tier.annualUsd > 0
                  ? `$${(tier.annualUsd / 12).toFixed(2)}/mo billed yearly`
                  : ""}
              </p>
              <p className="mt-2 text-sm text-[var(--color-brand-muted)]">
                ${tier.includedUsageUsd} of usage included each month
              </p>
              <ul className="mt-4 space-y-1.5 border-t border-[var(--color-border-subtle)] pt-4 text-xs leading-5 text-neutral-600">
                <li>{tier.projects}</li>
                <li>{tier.seats}</li>
                <li>{tier.cadence}</li>
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 3. What every plan includes */}
      <section className="mt-10 border-y border-[var(--color-border-subtle)] py-8">
        <p className="font-semibold text-neutral-950">
          Every plan includes
          <span className="ml-2 font-normal text-[var(--color-brand-muted)]">
            — including Free
          </span>
        </p>
        <ul className="mt-4 space-y-2">
          {[
            "Keyword research, backlinks, rank tracking, and site audits",
            "The full MCP server and agent skills — no higher tier required",
            "Works inside Claude, Cursor, and ChatGPT",
            "Google Search Console data, free and never billed as usage",
            "Buy extra usage anytime; it never expires",
          ].map((item) => (
            <li key={item} className="flex gap-2.5 text-sm text-neutral-700">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand-accent)]">
                <span className="sr-only">Included:</span>
              </span>
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center gap-4">
          <a
            href="/get-started"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-neutral-950 px-5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Check launch status
            <span aria-hidden="true" className="ml-1.5">
              &rarr;
            </span>
          </a>
          <p className="text-xs text-neutral-500">
            Public signup and payment are currently paused.
          </p>
        </div>
      </section>

      {/* 4. Where SearchCrew sits against the incumbents */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
          How that compares
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-brand-muted)]">
          The gap that matters is not the headline price — it is what it costs
          to let an agent reach your SEO data at all.
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-lg border-collapse text-left text-sm">
            <caption className="sr-only">
              SearchCrew list prices compared with Semrush and Ahrefs
            </caption>
            <thead>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <th
                  scope="col"
                  className="w-2/5 py-3 pr-4 font-medium text-neutral-500"
                >
                  <span className="sr-only">Comparison</span>
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold text-neutral-950">
                  SearchCrew
                </th>
                <th scope="col" className="py-3 pr-4 font-medium text-neutral-500">
                  Semrush
                </th>
                <th scope="col" className="py-3 font-medium text-neutral-500">
                  Ahrefs
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-[var(--color-border-subtle)]"
                >
                  <th
                    scope="row"
                    className="py-3 pr-4 align-top font-normal text-neutral-700"
                  >
                    {row.label}
                  </th>
                  <td className="py-3 pr-4 align-top font-semibold text-neutral-950">
                    {row.searchcrew}
                  </td>
                  <td className="py-3 pr-4 align-top text-[var(--color-brand-muted)]">
                    {row.semrush}
                  </td>
                  <td className="py-3 align-top text-[var(--color-brand-muted)]">
                    {row.ahrefs}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 max-w-2xl text-xs leading-5 text-neutral-500">
          Competitor figures are published list prices for month-to-month
          billing, checked {COMPARISON_CHECKED}. Semrush sells Standard API
          units separately on top of the plan fee. Plans and prices change —
          check theirs before you decide.
        </p>
      </section>

      {/* 5. The estimator */}
      <section className="mt-10">
        <div className="grid divide-y divide-[var(--color-border-subtle)] rounded-xl border border-[var(--color-border-subtle)] bg-white lg:grid-cols-[1.1fr_1fr] lg:divide-x lg:divide-y-0">
          {/* Inputs */}
          <div className="p-5 sm:p-6">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
              Estimate your month
            </h2>

            {/* Persona toggle */}
            <div
              className="mt-4 inline-flex rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-1"
              role="group"
              aria-label="Choose a starting point"
            >
              {(
                [
                  ["business", "My own business"],
                  ["freelancer", "Freelancer / agency"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => applyPersona(value)}
                  aria-pressed={persona === value}
                  className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    persona === value
                      ? "border border-[var(--color-border-subtle)] bg-white text-neutral-950 shadow-sm"
                      : "border border-transparent text-neutral-600 hover:text-neutral-950"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              <Slider
                label="Keyword searches / month"
                hint="About $0.05 per search at typical result limits."
                value={inputs.keywordRuns}
                min={0}
                max={1000}
                step={10}
                onChange={(v) => set("keywordRuns", v)}
              />
              <Slider
                label="Backlink checks / month"
                hint="About $0.08 for a domain overview with one year of history."
                value={inputs.backlinks}
                min={0}
                max={100}
                onChange={(v) => set("backlinks", v)}
              />
              <Slider
                label="ChatGPT brand checks / month"
                hint="This is the expensive one, about $1.09 each."
                value={inputs.aiScans}
                min={0}
                max={50}
                onChange={(v) => set("aiScans", v)}
              />
              {persona === "freelancer" ? (
                <>
                  <Slider
                    label="Local SERP checks / month"
                    hint="Google Maps or Local Finder via MCP, about $0.005 per check."
                    value={inputs.localSerps}
                    min={0}
                    max={1000}
                    step={10}
                    onChange={(v) => set("localSerps", v)}
                  />
                  <Slider
                    label="Websites"
                    value={inputs.sites}
                    min={1}
                    max={500}
                    onChange={(v) => set("sites", v)}
                  />
                </>
              ) : null}
              <Slider
                label="Keywords tracked per site"
                value={inputs.keywordsPerSite}
                min={0}
                max={200}
                step={5}
                onChange={(v) => set("keywordsPerSite", v)}
              />
              <Slider
                label="Rank tracking frequency"
                value={inputs.checksPerWeek}
                valueLabel={RANK_CHECK_LABELS[inputs.checksPerWeek]}
                options={RANK_CHECK_OPTIONS}
                onChange={(v) => set("checksPerWeek", v)}
              />
            </div>
          </div>

          {/* Results */}
          <div className="p-5 sm:p-6">
            <p className="text-sm text-[var(--color-brand-muted)]">
              Your estimated bill
            </p>
            <p className="mt-1 text-4xl font-semibold tabular-nums tracking-tight text-neutral-950">
              {usd(estimate.billUsd)}
              <span className="text-lg font-normal text-[var(--color-brand-muted)]">
                /mo
              </span>
            </p>
            {estimate.includedInBase ? (
              <p className="mt-2 text-sm leading-6 text-[var(--color-brand-muted)]">
                <span
                  aria-hidden="true"
                  className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 align-middle"
                />
                {usd(estimate.usageUsd)} of estimated usage fits inside the $
                {estimate.tier.includedUsageUsd} included with{" "}
                {estimate.tier.name}.
              </p>
            ) : (
              <p className="mt-2 text-sm leading-6 tabular-nums text-[var(--color-brand-muted)]">
                {estimate.tier.name} (${estimate.tier.priceUsd}) + ~
                {usd(estimate.topUpUsd)} of extra usage. Extra usage never
                expires.
              </p>
            )}

            {/* Per-feature breakdown */}
            <div className="mt-5 border-t border-[var(--color-border-subtle)] pt-5">
              <p className="text-sm font-semibold text-neutral-950">
                Where it goes
              </p>
              <dl className="mt-3 space-y-2.5">
                {estimate.lines.map((line) => (
                  <div
                    key={line.key}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <dt className="text-sm text-neutral-700">
                      {line.label}
                      <span className="block text-xs text-neutral-500">
                        {line.detail}
                      </span>
                    </dt>
                    <dd className="shrink-0 text-sm font-medium tabular-nums text-neutral-950">
                      {usd(line.credits * CREDIT_USD)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

          </div>
        </div>
      </section>

      {/* 4. FAQ */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
          FAQ
        </h2>
        <dl className="mt-5 divide-y divide-[var(--color-border-subtle)]">
          <div className="py-4 first:pt-0 last:pb-0">
            <dt className="text-sm font-medium text-neutral-950">
              Is there a free plan?
            </dt>
            <dd className="mt-1.5 text-sm leading-6 text-[var(--color-brand-muted)]">
              The proposed Free tier includes $2 of usage each month, one
              project, and the full MCP server with no card or trial clock.
            </dd>
          </div>
          <div className="py-4 first:pt-0 last:pb-0">
            <dt className="text-sm font-medium text-neutral-950">
              What if I use all my credits for the month?
            </dt>
            <dd className="mt-1.5 text-sm leading-6 text-[var(--color-brand-muted)]">
              The planned credit guard stops paid API tasks when the allowance
              runs out, so usage cannot create an unexpected bill. Top-ups will
              remain an explicit purchase after billing opens.
            </dd>
          </div>
          <div className="py-4 first:pt-0 last:pb-0">
            <dt className="text-sm font-medium text-neutral-950">
              What features use credits?
            </dt>
            <dd className="mt-1.5 text-sm leading-6 text-[var(--color-brand-muted)]">
              Under the proposed model, features that query DataForSEO&apos;s API
              consume credits — backlinks, keyword volume, competitor data,
              and site audits. Projects, settings, and saved data do not.
            </dd>
          </div>
          <div className="py-4 first:pt-0 last:pb-0">
            <dt className="text-sm font-medium text-neutral-950">
              Do unused credits roll over?
            </dt>
            <dd className="mt-1.5 text-sm leading-6 text-[var(--color-brand-muted)]">
              Proposed top-up credits roll over indefinitely. Included usage
              resets each billing cycle.
            </dd>
          </div>
          <div className="py-4 first:pt-0 last:pb-0">
            <dt className="text-sm font-medium text-neutral-950">
              Can I cancel anytime?
            </dt>
            <dd className="mt-1.5 text-sm leading-6 text-[var(--color-brand-muted)]">
              Billing is paused, so there is no active subscription to cancel.
              Final cancellation and refund terms will be published before
              payments open.
            </dd>
          </div>
          <div className="py-4 first:pt-0 last:pb-0">
            <dt className="text-sm font-medium text-neutral-950">
              Do I need a paid plan?
            </dt>
            <dd className="mt-1.5 text-sm leading-6 text-[var(--color-brand-muted)]">
              Under the proposed model, Free works within its monthly usage.
              Paid plans raise that allowance and add projects, seats, and
              daily rank tracking.
            </dd>
          </div>
        </dl>
      </section>
    </article>
  );
}

/* ------------------------------------------------------------------ *
 * Slider — native range input + live numeric readout.
 * ------------------------------------------------------------------ */
function Slider({
  label,
  hint,
  value,
  min,
  max,
  options,
  step = 1,
  valueLabel,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min?: number;
  max?: number;
  options?: readonly number[];
  step?: number;
  valueLabel?: string;
  onChange: (value: number) => void;
}) {
  const optionIndex = options?.indexOf(value) ?? -1;
  const sliderValue = options ? Math.max(0, optionIndex) : value;
  const sliderMin = options ? 0 : (min ?? 0);
  const sliderMax = options ? options.length - 1 : (max ?? 0);
  const progress =
    sliderMax === sliderMin
      ? 0
      : ((sliderValue - sliderMin) / (sliderMax - sliderMin)) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label className="text-sm font-medium text-neutral-800">{label}</label>
        <span className="text-sm font-semibold tabular-nums text-neutral-950">
          {valueLabel ?? value.toLocaleString()}
        </span>
      </div>
      {hint ? (
        <p className="mt-0.5 text-xs text-[var(--color-brand-muted)]">{hint}</p>
      ) : null}
      <input
        type="range"
        min={sliderMin}
        max={sliderMax}
        step={options ? 1 : step}
        value={sliderValue}
        onChange={(e) => {
          const next = Number(e.target.value);
          onChange(options?.[next] ?? next);
        }}
        aria-label={label}
        aria-valuetext={valueLabel}
        style={{ "--range-progress": `${progress}%` } as CSSProperties}
        className="seo-roi-range mt-1 block w-full"
      />
    </div>
  );
}
