import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isPublicBillingEnabled,
  isPublicSignupEnabled,
  shouldBlockPublicSignupRequest,
} from "@/lib/auth-mode";

describe("public launch gates", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("fails closed when a signup flag is missing or false", () => {
    vi.stubEnv("PUBLIC_SIGNUP_ENABLED", "");
    expect(isPublicSignupEnabled(undefined)).toBe(false);
    expect(isPublicSignupEnabled("false")).toBe(false);
  });

  it("opens signup only for the exact true value", () => {
    expect(isPublicSignupEnabled("true")).toBe(true);
    expect(isPublicSignupEnabled("TRUE")).toBe(false);
  });

  it("fails closed when a billing flag is missing or false", () => {
    vi.stubEnv("PUBLIC_BILLING_ENABLED", "");
    expect(isPublicBillingEnabled(undefined)).toBe(false);
    expect(isPublicBillingEnabled("false")).toBe(false);
  });

  it("opens billing only for the exact true value", () => {
    expect(isPublicBillingEnabled("true")).toBe(true);
    expect(isPublicBillingEnabled("1")).toBe(false);
  });

  it("blocks public signup endpoints while the gate is closed", () => {
    expect(
      shouldBlockPublicSignupRequest("/api/auth/sign-up/email", false),
    ).toBe(true);
    expect(
      shouldBlockPublicSignupRequest("/api/auth/sign-in/social", false),
    ).toBe(false);
    expect(
      shouldBlockPublicSignupRequest("/api/auth/sign-in/email", false),
    ).toBe(false);
    expect(
      shouldBlockPublicSignupRequest("/api/auth/sign-up/email", true),
    ).toBe(false);
  });
});
