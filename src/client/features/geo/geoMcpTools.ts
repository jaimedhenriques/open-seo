export const GEO_MCP_GROUP_LABEL = "GEO";

export const GEO_MCP_BADGE = "No credits";

export const GEO_MCP_HINT =
  "Credit-free crawler and llms.txt checks. Presence is not a ranking or citation lever. Hosted billing is paused; these tools are not a $10 SKU.";

export const GEO_MCP_TOOLS = [
  {
    name: "analyze_ai_crawler_access",
    title: "Analyze AI crawler access",
    description:
      "Map which named AI crawlers robots.txt allows or blocks. Uses no credits.",
  },
  {
    name: "analyze_llms_txt",
    title: "Analyze llms.txt",
    description:
      "Read /llms.txt format checks. Optional file. Uses no credits.",
  },
] as const;

export const GEO_MCP_TABLE_HEADS = ["Tool", "Check"] as const;

export const GEO_MCP_TABLE_CAPTION =
  "Credit-free MCP tools. Presence is not a ranking or citation lever.";

export function geoMcpToolsText(): string {
  return [
    GEO_MCP_GROUP_LABEL,
    GEO_MCP_BADGE,
    GEO_MCP_HINT,
    GEO_MCP_TABLE_CAPTION,
    ...GEO_MCP_TABLE_HEADS,
    ...GEO_MCP_TOOLS.map(
      (tool) => `${tool.name} ${tool.title} ${tool.description}`,
    ),
  ].join("\n");
}
