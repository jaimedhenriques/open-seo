import { describe, expect, it } from "vitest";
import {
  GEO_MCP_BADGE,
  GEO_MCP_GROUP_LABEL,
  GEO_MCP_HINT,
  GEO_MCP_TABLE_CAPTION,
  GEO_MCP_TABLE_HEADS,
  GEO_MCP_TOOLS,
  geoMcpToolsText,
} from "./geoMcpTools";

describe("GEO MCP kit card", () => {
  it("lists the credit-free crawler and llms.txt tools", () => {
    expect(GEO_MCP_GROUP_LABEL).toBe("GEO");
    expect(GEO_MCP_BADGE).toBe("No credits");
    expect(GEO_MCP_TOOLS.map((tool) => tool.name)).toEqual([
      "analyze_ai_crawler_access",
      "analyze_llms_txt",
    ]);
  });

  it("says the tools use no credits and are not a ranking lever", () => {
    const text = geoMcpToolsText().toLowerCase();
    expect(text).toContain("no credits");
    expect(text).toContain("optional");
    expect(text).toContain("not a ranking or citation lever");
    expect(GEO_MCP_HINT).toContain("$10 SKU");
  });

  it("lists MCP tools in a kit table", () => {
    expect(GEO_MCP_TABLE_HEADS).toEqual(["Tool", "Check"]);
    expect(GEO_MCP_TABLE_CAPTION.toLowerCase()).toContain("credit-free");
    expect(GEO_MCP_TABLE_CAPTION.toLowerCase()).toContain(
      "not a ranking or citation lever",
    );
  });

  it("does not use Fitch, a win-rate, or Autumn in GEO MCP copy", () => {
    const text = geoMcpToolsText().toLowerCase();
    expect(text).not.toMatch(/fitch|jaime|win-rate|autumn/);
  });
});
