import { describe, expect, it } from "vitest";
import { geoStatusAlertVariant } from "./geoStatusAlert";

describe("geoStatusAlertVariant", () => {
  it("uses destructive for fetch errors", () => {
    expect(geoStatusAlertVariant("error")).toBe("destructive");
  });

  it("uses default for empty GEO states", () => {
    expect(geoStatusAlertVariant("info")).toBe("default");
  });
});
