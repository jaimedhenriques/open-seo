import { describe, expect, it } from "vitest";
import {
  GEO_DASHBOARD_CARD,
  GEO_DASHBOARD_HAS_DATA,
  geoDashboardCardText,
  geoDashboardLinks,
} from "./geoDashboardCard";

describe("GEO dashboard card", () => {
  it("links to the credit-free crawler and llms.txt checks", () => {
    expect(GEO_DASHBOARD_HAS_DATA).toBe(true);
    expect(GEO_DASHBOARD_CARD.title).toBe("GEO");
    expect(geoDashboardCardText()).toContain("No credits");
    expect(geoDashboardLinks().map((item) => item.to)).toEqual([
      "/p/$projectId/geo-crawlers",
      "/p/$projectId/llms-txt",
    ]);
    expect(geoDashboardLinks().map((item) => item.label)).toEqual([
      "AI crawlers",
      "llms.txt",
    ]);
  });

  it("says the checks use no credits and are not a ranking lever", () => {
    const text = geoDashboardCardText().toLowerCase();
    expect(text).toContain("no credits");
    expect(text).toContain("not a ranking or citation lever");
    expect(GEO_DASHBOARD_CARD.hint).toContain("$10 SKU");
  });

  it("does not use Fitch, a win-rate, or Autumn in dashboard GEO copy", () => {
    const text = geoDashboardCardText().toLowerCase();
    expect(text).not.toMatch(/fitch|jaime|win-rate|autumn/);
  });
});
