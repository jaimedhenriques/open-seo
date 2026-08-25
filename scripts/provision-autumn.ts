import process from "node:process";
import {
  AUTUMN_MANAGED_ACCESS_FEATURE_ID,
  AUTUMN_PAID_PLAN_FEATURE_ID,
  AUTUMN_SEO_DATA_BALANCE_FEATURE_ID,
  AUTUMN_SEO_DATA_CREDITS_PER_USD,
  AUTUMN_SEO_DATA_TOPUP_BALANCE_FEATURE_ID,
  AUTUMN_SEO_DATA_TOP_UP_PLAN_ID,
  PLANS,
  autumnProductId,
} from "@/shared/billing";
import { loadLocalEnv, parseArgs } from "./cli-utils";

loadLocalEnv();

const args = parseArgs(process.argv.slice(2));

const API = "https://api.useautumn.com/v1";

await main();

/**
 * Create (or update) the Autumn features and products the app gates on, driven
 * by PLANS so the dashboard cannot drift from the code.
 *
 * Autumn keeps sandbox and production entirely separate, so the catalogue has
 * to be built once per environment — the key decides which one you hit. Run it
 * again after changing PLANS; every write is an upsert, so it is safe to
 * repeat.
 *
 * Usage: AUTUMN_SECRET_KEY=am_sk_... pnpm billing:provision [--dry-run=true]
 */
async function main() {
  const key = process.env.AUTUMN_SECRET_KEY;
  if (!key) {
    console.error(
      "Missing AUTUMN_SECRET_KEY. Copy it from app.useautumn.com (Developer → API keys).",
    );
    process.exit(1);
  }

  const dryRun = args["dry-run"] === "true";
  const mode = key.startsWith("am_sk_live_") ? "PRODUCTION" : "sandbox";
  console.log(
    `Provisioning Autumn (${mode})${dryRun ? " — dry run, no writes" : ""}\n`,
  );

  for (const feature of features()) {
    await upsert(key, "features", feature.id, feature, dryRun);
  }
  for (const product of products()) {
    await upsert(key, "products", product.id, product, dryRun);
  }

  console.log(
    `\nDone. ${mode === "sandbox" ? "This was the sandbox — rerun with the live key before taking real payments." : "Live catalogue is in place."}`,
  );
}

function features() {
  return [
    {
      id: AUTUMN_PAID_PLAN_FEATURE_ID,
      name: "Paid Plan",
      type: "boolean",
    },
    {
      id: AUTUMN_MANAGED_ACCESS_FEATURE_ID,
      name: "Managed Service Access",
      type: "boolean",
    },
    // Consumable: both pools are spent down by DataForSEO and onboarding-LLM
    // calls rather than representing a standing limit.
    {
      id: AUTUMN_SEO_DATA_BALANCE_FEATURE_ID,
      name: "Usage Credits",
      type: "metered",
      consumable: true,
    },
    {
      id: AUTUMN_SEO_DATA_TOPUP_BALANCE_FEATURE_ID,
      name: "Top-up Credits",
      type: "metered",
      consumable: true,
    },
  ];
}

type AutumnItem = {
  feature_id: string;
  included?: number;
  reset?: { interval: string };
  price?: Record<string, string | number>;
};

type AutumnProduct = {
  id: string;
  name: string;
  auto_enable?: boolean;
  add_on?: boolean;
  price?: { amount: number; interval: string };
  items: AutumnItem[];
};

function products(): AutumnProduct[] {
  const tiers = PLANS.flatMap<AutumnProduct>((plan) => {
    // Monthly credits reset each cycle on every tier, including Free; only
    // top-ups roll over.
    const grants: AutumnItem[] = [
      { feature_id: AUTUMN_MANAGED_ACCESS_FEATURE_ID },
      {
        feature_id: AUTUMN_SEO_DATA_BALANCE_FEATURE_ID,
        included: plan.monthlyCredits,
        reset: { interval: "month" },
      },
    ];

    if (plan.monthlyUsd === 0) {
      // Free is Autumn's default product, so every signed-up customer holds it
      // without an explicit attach.
      return [
        {
          id: plan.id,
          name: plan.name,
          auto_enable: true,
          items: grants,
        },
      ];
    }

    const paid = [{ feature_id: AUTUMN_PAID_PLAN_FEATURE_ID }, ...grants];
    return [
      {
        id: autumnProductId(plan.id, "monthly"),
        name: plan.name,
        price: { amount: plan.monthlyUsd, interval: "month" },
        items: paid,
      },
      {
        id: autumnProductId(plan.id, "annual"),
        name: `${plan.name} (Annual)`,
        price: { amount: plan.annualUsd, interval: "year" },
        items: paid,
      },
    ];
  });

  return [
    ...tiers,
    {
      // Add-on so it stacks on whatever tier the customer already holds.
      id: AUTUMN_SEO_DATA_TOP_UP_PLAN_ID,
      name: "Credit Top-up",
      add_on: true,
      items: [
        {
          feature_id: AUTUMN_SEO_DATA_TOPUP_BALANCE_FEATURE_ID,
          price: {
            amount: 1,
            interval: "one_off",
            billing_method: "prepaid",
            billing_units: AUTUMN_SEO_DATA_CREDITS_PER_USD,
          },
        },
      ],
    },
  ];
}

/** Create the resource, falling back to an update when it already exists. */
async function upsert(
  key: string,
  collection: "features" | "products",
  id: string,
  body: unknown,
  dryRun: boolean,
) {
  if (dryRun) {
    console.log(`  would upsert ${collection}/${id}`);
    return;
  }

  const created = await request(key, "POST", `/${collection}`, body);
  if (created.ok) {
    console.log(`  created ${collection}/${id}`);
    return;
  }

  const updated = await request(key, "POST", `/${collection}/${id}`, body);
  if (updated.ok) {
    console.log(`  updated ${collection}/${id}`);
    return;
  }

  console.error(`  FAILED ${collection}/${id}: ${updated.detail}`);
  process.exitCode = 1;
}

async function request(
  key: string,
  method: string,
  path: string,
  body: unknown,
) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return { ok: res.ok, detail: text.slice(0, 200) };
}
