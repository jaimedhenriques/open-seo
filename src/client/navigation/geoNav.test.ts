import { describe, expect, it } from "vitest";
import { GEO_NAV_GROUP_LABEL, GEO_NAV_ITEMS } from "./geoNav";

describe("GEO nav group", () => {
  it("lists crawler and llms.txt checks", () => {
    expect(GEO_NAV_GROUP_LABEL).toBe("GEO");
    expect(GEO_NAV_ITEMS.map((item) => item.to)).toEqual([
      "/p/$projectId/geo-crawlers",
      "/p/$projectId/llms-txt",
    ]);
    expect(GEO_NAV_ITEMS.map((item) => item.label)).toEqual([
      "AI crawlers",
      "llms.txt",
    ]);
  });

  it("does not use Fitch, a win-rate, or a $10 SKU in GEO nav labels", () => {
    const text = `${GEO_NAV_GROUP_LABEL} ${GEO_NAV_ITEMS.map((item) => item.label).join(" ")}`;
    expect(text.toLowerCase()).not.toMatch(/fitch|jaime|win-rate|autumn|\$10/);
  });
});
