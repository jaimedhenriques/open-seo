/**
 * Container-start preflight for Docker self-hosting. Validates the environment
 * before migrations and the vite build so misconfiguration fails in seconds
 * with the exact fix. Run via: pnpm exec tsx scripts/selfhost-preflight.ts
 *
 * Exits non-zero on hard failures (invalid AUTH_MODE, missing auth config for
 * the selected mode). Warnings and info lines never block startup.
 */
import process from "node:process";
import {
  formatPreflightReport,
  runSelfhostPreflight,
} from "../src/lib/selfhost-preflight";
import { isTelemetryOptOutValue } from "../src/shared/selfhost-checks";
import { sendPreflightFailedBeacon } from "../src/shared/selfhost-preflight-telemetry";
import { version } from "../package.json";

function telemetryDisabled(): boolean {
  return (
    isTelemetryOptOutValue(process.env.SEARCHCREW_TELEMETRY_DISABLED) ||
    isTelemetryOptOutValue(process.env.DO_NOT_TRACK)
  );
}

const result = runSelfhostPreflight(process.env);

console.log("--- SearchCrew self-host preflight ---");
console.log(formatPreflightReport(result));

if (result.failed) {
  await sendPreflightFailedBeacon(
    result.items
      .filter((item) => item.level === "fail")
      .map((item) => item.name),
    {
      posthogKey: process.env.SELF_HOST_POSTHOG_KEY,
      telemetryDisabled: telemetryDisabled(),
      version,
      fetchImpl: fetch,
      randomUUID: () => crypto.randomUUID(),
    },
  );
  process.exit(1);
}
