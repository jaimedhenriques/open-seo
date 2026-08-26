import process from "node:process";
import {
  buildAutumnFeatures,
  buildAutumnProducts,
} from "@/shared/autumn-catalog";
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

  for (const feature of buildAutumnFeatures()) {
    await upsert(key, "features", feature.id, feature, dryRun);
  }
  for (const product of buildAutumnProducts()) {
    await upsert(key, "products", product.id, product, dryRun);
  }

  console.log(
    `\nDone. ${mode === "sandbox" ? "This was the sandbox — rerun with the live key before taking real payments." : "Live catalogue is in place."}`,
  );
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
