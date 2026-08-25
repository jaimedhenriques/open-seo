const SELF_HOST_POSTHOG_HOST = "https://us.i.posthog.com";

type PreflightBeaconOptions = {
  posthogKey: string | undefined;
  telemetryDisabled: boolean;
  version: string;
  fetchImpl: typeof fetch;
  randomUUID: () => string;
};

/**
 * Report failed check names only. An unset deployment key is an explicit
 * no-telemetry configuration, never a reason to fall back to a shared key.
 */
export async function sendPreflightFailedBeacon(
  failedChecks: string[],
  options: PreflightBeaconOptions,
) {
  if (options.telemetryDisabled || !options.posthogKey) return;

  try {
    await options.fetchImpl(`${SELF_HOST_POSTHOG_HOST}/i/v0/e/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({
        api_key: options.posthogKey,
        event: "self_host.preflight_failed",
        distinct_id: options.randomUUID(),
        properties: {
          failedChecks,
          version: options.version,
          $process_person_profile: false,
        },
      }),
    });
  } catch {
    // Telemetry must never affect startup.
  }
}
