import { describe, expect, it } from "vitest";
import { GEO_MCP_NAV, geoSiblingLink } from "./geoSiblingLink";

describe("geoSiblingLink", () => {
  it("sends crawler users to the llms.txt page", () => {
    const link = geoSiblingLink("crawlers");
    expect(link.to).toBe("/p/$projectId/llms-txt");
    expect(link.label).toBe("Check llms.txt");
    expect(link.hint.toLowerCase()).toContain("no credits");
  });

  it("sends llms.txt users to the crawler page", () => {
    const link = geoSiblingLink("llms-txt");
    expect(link.to).toBe("/p/$projectId/geo-crawlers");
    expect(link.label).toBe("Check AI crawlers");
    expect(link.hint.toLowerCase()).toContain("no credits");
  });

  it("sends GEO check users to the MCP tools page", () => {
    expect(GEO_MCP_NAV.to).toBe("/ai");
    expect(GEO_MCP_NAV.label).toBe("MCP tools");
    expect(GEO_MCP_NAV.hint.toLowerCase()).toContain("no credits");
    expect(GEO_MCP_NAV.hint).toContain("analyze_ai_crawler_access");
    expect(GEO_MCP_NAV.hint).toContain("analyze_llms_txt");
  });

  it("keeps the MCP hint as visible copy, not only a title", () => {
    expect(GEO_MCP_NAV.hint.length).toBeGreaterThan(0);
    expect(GEO_MCP_NAV.hint.toLowerCase()).toContain("no credits");
  });

  it("does not claim Fitch, a win-rate, or a $10 SKU", () => {
    const text = `${geoSiblingLink("crawlers").hint} ${geoSiblingLink("llms-txt").hint} ${GEO_MCP_NAV.hint}`;
    expect(text.toLowerCase()).not.toMatch(/fitch|jaime|win-rate|autumn|\$10/);
  });
});
