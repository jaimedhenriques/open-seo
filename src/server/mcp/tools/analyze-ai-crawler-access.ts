import { z } from "zod";
import { AppError } from "@/server/lib/errors";
import { fetchAiCrawlerAccess } from "@/server/lib/geo/fetchAiCrawlerAccess";
import { mcpResponse } from "@/server/mcp/formatters";
import { buildProjectMeta } from "@/server/mcp/context";
import { optionalMetaOutputSchema } from "@/server/mcp/output-schemas";
import { withMcpProjectAuth } from "@/server/mcp/project-auth";
import { projectIdSchema } from "@/server/mcp/schemas";
import { formatMcpTable } from "@/server/mcp/table";

const crawlerRowSchema = z
  .object({
    userAgent: z.string(),
    operator: z.string(),
    tier: z.enum(["search", "ecosystem", "training"]),
    status: z.enum(["allowed", "blocked"]),
    rule: z.enum(["specific", "wildcard", "default"]),
  })
  .passthrough();

const inputSchema = {
  projectId: projectIdSchema,
  url: z
    .string()
    .min(1)
    .max(2048)
    .optional()
    .describe(
      "Site URL or domain to check. Defaults to the project's domain. Uses no credits.",
    ),
} as const;

type Args = z.infer<z.ZodObject<typeof inputSchema>>;

export const analyzeAiCrawlerAccessTool = {
  name: "analyze_ai_crawler_access",
  config: {
    title: "Analyze AI crawler access",
    description:
      "Reads robots.txt and reports which named AI crawlers can fetch the site (ChatGPT Search, Claude search, Perplexity, Googlebot, and training bots). Also notes whether /llms.txt exists. This is an access map, not a ranking or citation prediction. Training-bot blocks are reported without treating them as defects. Uses no credits — does not call DataForSEO.",
    inputSchema,
    outputSchema: z
      .object({
        origin: z.string(),
        robotsTxt: z
          .object({
            url: z.string(),
            status: z.enum(["found", "missing", "error"]),
            httpStatus: z.number().nullable(),
          })
          .passthrough(),
        llmsTxt: z
          .object({
            url: z.string(),
            status: z.enum(["found", "missing", "error"]),
            httpStatus: z.number().nullable(),
          })
          .passthrough(),
        crawlers: z.array(crawlerRowSchema),
        sitemapUrls: z.array(z.string()),
        contentSignals: z.record(z.string(), z.string()).nullable(),
        ...optionalMetaOutputSchema,
      })
      .passthrough(),
    annotations: {
      readOnlyHint: true,
      openWorldHint: false,
      destructiveHint: false,
    },
  },
  handler: withMcpProjectAuth(async (args: Args, context) => {
    const target = args.url?.trim() || context.project.domain;
    if (!target) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Pass url or set a domain on this project.",
      );
    }

    const report = await fetchAiCrawlerAccess(target);
    const blockedSearch = report.crawlers.filter(
      (row) => row.tier === "search" && row.status === "blocked",
    );
    const table = formatMcpTable(report.crawlers, [
      { header: "crawler", value: (row) => row.userAgent },
      { header: "tier", value: (row) => row.tier },
      { header: "status", value: (row) => row.status },
      { header: "rule", value: (row) => row.rule },
    ]);
    const headline =
      blockedSearch.length === 0
        ? `No search/retrieval crawlers are blocked at ${report.origin}.`
        : `${blockedSearch.length} search/retrieval crawler${blockedSearch.length === 1 ? " is" : "s are"} blocked at ${report.origin}.`;

    return mcpResponse({
      text: [
        headline,
        `robots.txt: ${report.robotsTxt.status}${report.robotsTxt.httpStatus != null ? ` (${report.robotsTxt.httpStatus})` : ""}`,
        `llms.txt: ${report.llmsTxt.status} — optional content map, not a ranking lever.`,
        report.pageSample.tokens.length > 0
          ? `page sample: ${report.pageSample.tokens.join(", ")} at ${report.pageSample.url}`
          : `page sample: no noai or X-Robots-Tag on ${report.pageSample.url}`,
        report.pageSample.jsonLd.types.length > 0
          ? `json-ld: ${report.pageSample.jsonLd.types.join(", ")} — presence only, not a ranking or citation lever.`
          : report.pageSample.jsonLd.status === "invalid"
            ? "json-ld: invalid JSON on this page."
            : "json-ld: none on this page (optional).",
        table,
      ].join("\n"),
      meta: buildProjectMeta(context, args.projectId),
      structuredContent: report,
    });
  }),
};
