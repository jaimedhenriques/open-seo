import type { AiCrawlerAccessReport } from "@/server/lib/geo/aiCrawlerAccess";
import type { BadgeVariant } from "@/client/ui/badge";

export const GEO_CRAWLER_PAGE_BADGE = "Access map";

export const GEO_CRAWLER_FILTERS = [
  { id: "all", label: "All" },
  { id: "search", label: "Search" },
  { id: "training", label: "Training" },
] as const;

export type GeoCrawlerFilterId = (typeof GEO_CRAWLER_FILTERS)[number]["id"];

export const GEO_CRAWLER_FILTER_HINT =
  "Training blocks are a preference, not a ranking defect. Uses no credits.";

export const GEO_CRAWLER_EMPTY_FILTER =
  "No crawlers in this kind. Training blocks stay a preference, not a ranking defect. Uses no credits.";

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
  pageSampleLabel: string;
  pageSampleHint: string;
  jsonLdLabel: string;
  jsonLdHint: string;
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

export function tierBadgeVariant(tier: GeoCrawlerRow["tier"]): BadgeVariant {
  if (tier === "search") return "secondary";
  if (tier === "training") return "outline";
  return "ghost";
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

export function filterCrawlerRows(
  rows: GeoCrawlerRow[],
  filter: GeoCrawlerFilterId,
): GeoCrawlerRow[] {
  if (filter === "all") return rows;
  return rows.filter((row) => row.tier === filter);
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
    pageSampleLabel: pageSampleLabel(report),
    pageSampleHint: "Sample of the checked URL only. Not a sitewide crawl.",
    jsonLdLabel: jsonLdLabel(report),
    jsonLdHint: "Presence only. Optional. Not a ranking or citation lever.",
  };
}

function pageSampleLabel(report: AiCrawlerAccessReport): string {
  const sample = report.pageSample;
  if (sample.status !== "found") {
    return "Could not sample the page";
  }
  if (sample.tokens.length === 0) {
    return "No noai or X-Robots-Tag on this page";
  }
  return `Page sample: ${sample.tokens.join(", ")}`;
}

function jsonLdLabel(report: AiCrawlerAccessReport): string {
  const jsonLd = report.pageSample.jsonLd;
  if (report.pageSample.status !== "found") {
    return "Could not sample JSON-LD";
  }
  if (jsonLd.status === "invalid") {
    return "JSON-LD is invalid JSON";
  }
  if (jsonLd.status === "missing" || jsonLd.types.length === 0) {
    return "No JSON-LD on this page (optional)";
  }
  return jsonLd.types.join(", ");
}
