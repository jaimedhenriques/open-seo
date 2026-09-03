import { describe, expect, it } from "vitest";
import {
  canSubmitUrl,
  GEO_CRAWLER_PAGE_BADGE,
  ruleLabel,
  sortCrawlerRows,
  statusBadgeVariant,
  statusLabel,
  summarizeGeoCrawlerReport,
  tierLabel,
} from "./geoCrawlerView";
import type { AiCrawlerAccessReport } from "@/server/lib/geo/aiCrawlerAccess";

function report(
  overrides: Partial<AiCrawlerAccessReport> = {},
): AiCrawlerAccessReport {
  return {
    origin: "https://example.com",
    robotsTxt: {
      url: "https://example.com/robots.txt",
      status: "found",
      httpStatus: 200,
    },
    llmsTxt: {
      url: "https://example.com/llms.txt",
      status: "missing",
      httpStatus: 404,
    },
    crawlers: [
      {
        userAgent: "OAI-SearchBot",
        operator: "OpenAI",
        tier: "search",
        status: "blocked",
        rule: "specific",
      },
      {
        userAgent: "Googlebot",
        operator: "Google",
        tier: "search",
        status: "allowed",
        rule: "wildcard",
      },
      {
        userAgent: "GPTBot",
        operator: "OpenAI",
        tier: "training",
        status: "blocked",
        rule: "specific",
      },
    ],
    sitemapUrls: [],
    contentSignals: null,
    pageSample: {
      url: "https://example.com/",
      status: "found",
      httpStatus: 200,
      robotsMeta: null,
      xRobotsTag: null,
      tokens: [],
      jsonLd: { status: "missing", blockCount: 0, types: [] },
    },
    ...overrides,
  };
}

describe("GEO crawler page badge", () => {
  it("marks the crawler page as an access map, not a ranking lever", () => {
    expect(GEO_CRAWLER_PAGE_BADGE).toBe("Access map");
    expect(GEO_CRAWLER_PAGE_BADGE.toLowerCase()).not.toMatch(
      /fitch|jaime|win-rate|autumn|\$10|ranking|citation|optional/,
    );
  });
});

describe("summarizeGeoCrawlerReport", () => {
  it("counts only search crawlers in the headline", () => {
    const summary = summarizeGeoCrawlerReport(report());
    expect(summary.headline).toBe(
      "1 search crawler is blocked at https://example.com.",
    );
    expect(summary.blockedSearch).toBe(1);
    expect(summary.blockedTraining).toBe(1);
    expect(summary.searchTotal).toBe(2);
    expect(summary.llmsLabel).toBe("No llms.txt (optional)");
  });

  it("labels a page sample with noai without calling it a ranking defect", () => {
    const summary = summarizeGeoCrawlerReport(
      report({
        pageSample: {
          url: "https://example.com/",
          status: "found",
          httpStatus: 200,
          robotsMeta: "noai",
          xRobotsTag: null,
          tokens: ["noai"],
          jsonLd: { status: "missing", blockCount: 0, types: [] },
        },
      }),
    );
    expect(summary.pageSampleLabel).toBe("Page sample: noai");
    expect(summary.pageSampleHint).toContain("checked URL");
  });

  it("uses a clear empty-block headline", () => {
    const summary = summarizeGeoCrawlerReport(
      report({
        crawlers: [
          {
            userAgent: "Googlebot",
            operator: "Google",
            tier: "search",
            status: "allowed",
            rule: "default",
          },
        ],
      }),
    );
    expect(summary.headline).toContain("No search crawlers are blocked");
  });

  it("labels missing robots as allow-all and llms as optional", () => {
    const summary = summarizeGeoCrawlerReport(
      report({
        robotsTxt: {
          url: "https://example.com/robots.txt",
          status: "missing",
          httpStatus: 404,
        },
        llmsTxt: {
          url: "https://example.com/llms.txt",
          status: "missing",
          httpStatus: 404,
        },
      }),
    );
    expect(summary.robotsLabel).toBe("No robots.txt — crawlers inherit allow");
    expect(summary.llmsLabel).toBe("No llms.txt (optional)");
  });

  it("labels unread robots and llms without calling them blocks", () => {
    const summary = summarizeGeoCrawlerReport(
      report({
        robotsTxt: {
          url: "https://example.com/robots.txt",
          status: "error",
          httpStatus: 500,
        },
        llmsTxt: {
          url: "https://example.com/llms.txt",
          status: "error",
          httpStatus: 500,
        },
      }),
    );
    expect(summary.robotsLabel).toBe("Could not read robots.txt");
    expect(summary.llmsLabel).toBe("Could not read llms.txt");
  });

  it("labels JSON-LD types without calling them a ranking lever", () => {
    const summary = summarizeGeoCrawlerReport(
      report({
        pageSample: {
          url: "https://example.com/",
          status: "found",
          httpStatus: 200,
          robotsMeta: null,
          xRobotsTag: null,
          tokens: [],
          jsonLd: {
            status: "found",
            blockCount: 1,
            types: ["Organization", "WebSite"],
          },
        },
      }),
    );
    expect(summary.jsonLdLabel).toBe("Organization, WebSite");
    expect(summary.jsonLdHint.toLowerCase()).toContain("not a ranking");
    expect(summary.jsonLdHint.toLowerCase()).not.toMatch(
      /fitch|jaime|win-rate|autumn|\$10/,
    );
  });

  it("labels missing JSON-LD as optional", () => {
    const summary = summarizeGeoCrawlerReport(report());
    expect(summary.jsonLdLabel).toBe("No JSON-LD on this page (optional)");
  });
});

describe("sortCrawlerRows", () => {
  it("puts search crawlers before training crawlers", () => {
    const sorted = sortCrawlerRows(report().crawlers);
    expect(sorted.map((row) => row.userAgent)).toEqual([
      "Googlebot",
      "OAI-SearchBot",
      "GPTBot",
    ]);
  });
});

describe("url and labels", () => {
  it("rejects an empty URL", () => {
    expect(canSubmitUrl("")).toBe(false);
    expect(canSubmitUrl("   ")).toBe(false);
    expect(canSubmitUrl("example.com")).toBe(true);
  });

  it("uses plain-language labels", () => {
    expect(statusLabel("allowed")).toBe("Allowed");
    expect(statusLabel("blocked")).toBe("Blocked");
    expect(tierLabel("search")).toBe("Search");
    expect(tierLabel("training")).toBe("Training");
    expect(ruleLabel("specific")).toBe("Named rule");
    expect(ruleLabel("default")).toBe("Default allow");
  });
});

describe("statusBadgeVariant", () => {
  it("treats allowed as secondary and search blocks as destructive", () => {
    expect(
      statusBadgeVariant({
        userAgent: "Googlebot",
        operator: "Google",
        tier: "search",
        status: "allowed",
        rule: "wildcard",
      }),
    ).toBe("secondary");
    expect(
      statusBadgeVariant({
        userAgent: "OAI-SearchBot",
        operator: "OpenAI",
        tier: "search",
        status: "blocked",
        rule: "specific",
      }),
    ).toBe("destructive");
    expect(
      statusBadgeVariant({
        userAgent: "GPTBot",
        operator: "OpenAI",
        tier: "training",
        status: "blocked",
        rule: "specific",
      }),
    ).toBe("outline");
    expect(
      statusBadgeVariant({
        userAgent: "GoogleOther",
        operator: "Google",
        tier: "ecosystem",
        status: "blocked",
        rule: "wildcard",
      }),
    ).toBe("outline");
  });
});
