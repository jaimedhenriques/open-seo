import type { AiCrawlerAccessReport } from "@/server/lib/geo/aiCrawlerAccess";
import type { BadgeVariant } from "@/client/ui/badge";

type GeoCrawlerRow = AiCrawlerAccessReport["crawlers"][number];

const TIER_ORDER: Record<GeoCrawlerRow["tier"], number> = {
  search: 0,
  ecosystem: 1,
  training: 2,
};

type GeoCrawlerSummary = {
  headline: string;
  blockedSearch: number;
  blockedTraining: number;
  searchTotal: number;
  llmsLabel: string;
  robotsLabel: string;
};

export function canSubmitUrl(value: string): boolean {
  return value.trim().length > 0;
}

export function statusBadgeVariant(row: GeoCrawlerRow): BadgeVariant {
  if (row.status === "allowed") return "secondary";
  if (row.tier === "search") return "destructive";
  return "outline";
}

export function statusLabel(status: GeoCrawlerRow["status"]): string {
  return status === "allowed" ? "Allowed" : "Blocked";
}

export function tierLabel(tier: GeoCrawlerRow["tier"]): string {
  if (tier === "search") return "Search";
  if (tier === "ecosystem") return "Ecosystem";
  return "Training";
}

export function ruleLabel(rule: GeoCrawlerRow["rule"]): string {
  if (rule === "specific") return "Named rule";
  if (rule === "wildcard") return "* wildcard";
  return "Default allow";
}

export function sortCrawlerRows(rows: GeoCrawlerRow[]): GeoCrawlerRow[] {
  return rows.toSorted((left, right) => {
    const tierDiff = TIER_ORDER[left.tier] - TIER_ORDER[right.tier];
    if (tierDiff !== 0) return tierDiff;
    return left.userAgent.localeCompare(right.userAgent);
  });
}

export function summarizeGeoCrawlerReport(
  report: AiCrawlerAccessReport,
): GeoCrawlerSummary {
  const search = report.crawlers.filter((row) => row.tier === "search");
  const blockedSearch = search.filter((row) => row.status === "blocked").length;
  const blockedTraining = report.crawlers.filter(
    (row) => row.tier === "training" && row.status === "blocked",
  ).length;
  const headline =
    blockedSearch === 0
      ? `No search crawlers are blocked at ${report.origin}.`
      : `${blockedSearch} search crawler${blockedSearch === 1 ? " is" : "s are"} blocked at ${report.origin}.`;
  return {
    headline,
    blockedSearch,
    blockedTraining,
    searchTotal: search.length,
    llmsLabel:
      report.llmsTxt.status === "found"
        ? "llms.txt is published"
        : report.llmsTxt.status === "missing"
          ? "No llms.txt (optional)"
          : "Could not read llms.txt",
    robotsLabel:
      report.robotsTxt.status === "found"
        ? "robots.txt found"
        : report.robotsTxt.status === "missing"
          ? "No robots.txt — crawlers inherit allow"
          : "Could not read robots.txt",
  };
}
