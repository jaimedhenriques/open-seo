import { describe, expect, it, vi } from "vitest";
import { sendPreflightFailedBeacon } from "./selfhost-preflight-telemetry";

describe("sendPreflightFailedBeacon", () => {
  it("does not make a request when no deployment telemetry key is configured", async () => {
    const fetchImpl = vi.fn<typeof fetch>();

    await sendPreflightFailedBeacon(["auth"], {
      posthogKey: undefined,
      telemetryDisabled: false,
      version: "1.2.3",
      fetchImpl,
      randomUUID: () => "install-1",
    });

    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("sends only failed check names with the configured deployment key", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response());

    await sendPreflightFailedBeacon(["auth", "database"], {
      posthogKey: "deployment-key",
      telemetryDisabled: false,
      version: "1.2.3",
      fetchImpl,
      randomUUID: () => "install-1",
    });

    expect(fetchImpl).toHaveBeenCalledOnce();
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://us.i.posthog.com/i/v0/e/",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: "deployment-key",
          event: "self_host.preflight_failed",
          distinct_id: "install-1",
          properties: {
            failedChecks: ["auth", "database"],
            version: "1.2.3",
            $process_person_profile: false,
          },
        }),
      }),
    );
  });
});
