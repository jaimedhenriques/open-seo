import { z } from "zod";
import { AppError } from "@/server/lib/errors";
import { fetchLlmsTxt } from "@/server/lib/geo/fetchAiCrawlerAccess";
import { mcpResponse } from "@/server/mcp/formatters";
import { buildProjectMeta } from "@/server/mcp/context";
import { optionalMetaOutputSchema } from "@/server/mcp/output-schemas";
import { withMcpProjectAuth } from "@/server/mcp/project-auth";
import { projectIdSchema } from "@/server/mcp/schemas";
import { formatMcpTable } from "@/server/mcp/table";

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

export const analyzeLlmsTxtTool = {
  name: "analyze_llms_txt",
  config: {
    title: "Analyze llms.txt",
    description:
      "Reads /llms.txt and reports title, sections, listed pages, and format checks. This is an optional content map, not a ranking or citation prediction. Missing file is not a defect. Uses no credits — does not call DataForSEO.",
    inputSchema,
    outputSchema: z
      .object({
        origin: z.string(),
        url: z.string(),
        fetchStatus: z.enum(["found", "missing", "error"]),
        httpStatus: z.number().nullable(),
        title: z.string().nullable(),
        description: z.string().nullable(),
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

    const report = await fetchLlmsTxt(target);
    const pages = report.sections.flatMap((section) => section.entries);
    const failed = report.checks.filter((check) => check.status === "fail");
    const headline =
      report.fetchStatus === "missing"
        ? `No llms.txt at ${report.origin}. Optional file, not a ranking defect.`
        : report.fetchStatus === "error"
          ? `Could not read llms.txt at ${report.origin}.`
          : `llms.txt at ${report.origin}: ${pages.length} page${pages.length === 1 ? "" : "s"}, ${failed.length} format ${failed.length === 1 ? "issue" : "issues"}.`;

    const table = formatMcpTable(report.checks, [
      { header: "check", value: (row) => row.label },
      { header: "status", value: (row) => row.status },
      { header: "detail", value: (row) => row.detail },
    ]);

    return mcpResponse({
      text: [headline, `file: ${report.fetchStatus}`, table].join("\n"),
      meta: buildProjectMeta(
        context,
        args.projectId,
        `/p/${args.projectId}/llms-txt`,
      ),
      structuredContent: report,
    });
  }),
};
