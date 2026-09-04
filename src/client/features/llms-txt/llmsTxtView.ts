import type { BadgeVariant } from "@/client/ui/badge";
import type { LlmsTxtCheck, LlmsTxtReport } from "@/server/lib/geo/llmsTxt";

export const LLMS_PAGE_BADGE = "Optional";

export function canSubmitUrl(value: string): boolean {
  return value.trim().length > 0;
}

export function checkBadgeVariant(
  status: LlmsTxtCheck["status"],
): BadgeVariant {
  return status === "pass" ? "secondary" : "destructive";
}

export function summarizeLlmsTxt(report: LlmsTxtReport): {
  headline: string;
  statusLabel: string;
  passCount: number;
  failCount: number;
  pageCount: number;
} {
  const pageCount = report.sections.reduce(
    (sum, section) => sum + section.entries.length,
    0,
  );
  const passCount = report.checks.filter(
    (check) => check.status === "pass",
  ).length;
  const failCount = report.checks.length - passCount;

  if (report.fetchStatus === "missing") {
    return {
      headline: `No llms.txt at ${report.origin}. Optional file, not a ranking defect.`,
      statusLabel: "Not published",
      passCount: 0,
      failCount: 0,
      pageCount: 0,
    };
  }
  if (report.fetchStatus === "error") {
    return {
      headline: `Could not read llms.txt at ${report.origin}.`,
      statusLabel: "Unread",
      passCount: 0,
      failCount: 0,
      pageCount: 0,
    };
  }
  return {
    headline: `llms.txt at ${report.origin}: ${pageCount} page${pageCount === 1 ? "" : "s"}, ${failCount} format ${failCount === 1 ? "issue" : "issues"}. Optional content map, not a ranking lever.`,
    statusLabel: failCount === 0 ? "Format ok" : "Format issues",
    passCount,
    failCount,
    pageCount,
  };
}
