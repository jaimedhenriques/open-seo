import { describe, expect, it } from "vitest";
import {
  evaluateAiCrawlerAccess,
  parseRobotsGroups,
} from "./aiCrawlerAccess";

describe("parseRobotsGroups", () => {
  it("keeps adjacent user-agent lines in one group", () => {
    const { groups } = parseRobotsGroups(`
User-agent: GPTBot
User-agent: ClaudeBot
Disallow: /
`);
    expect(groups).toEqual([
      {
        agents: ["gptbot", "claudebot"],
        allows: [],
        disallows: ["/"],
      },
    ]);
  });

  it("parses sitemap and content-signal lines", () => {
    const parsed = parseRobotsGroups(`
User-agent: *
Allow: /
Sitemap: https://example.com/sitemap.xml
Content-Signal: ai-train=no, search=yes
`);
    expect(parsed.sitemapUrls).toEqual(["https://example.com/sitemap.xml"]);
    expect(parsed.contentSignals).toEqual({
      "ai-train": "no",
      search: "yes",
    });
  });
});

describe("evaluateAiCrawlerAccess", () => {
  it("allows every crawler when robots.txt is missing", () => {
    const report = evaluateAiCrawlerAccess(null);
    expect(report.crawlers.every((row) => row.status === "allowed")).toBe(
      true,
    );
    expect(report.crawlers.every((row) => row.rule === "default")).toBe(true);
  });

  it("blocks a named search crawler without scoring training blocks as defects", () => {
    const report = evaluateAiCrawlerAccess(`
User-agent: OAI-SearchBot
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: *
Allow: /
`);
    const searchBot = report.crawlers.find(
      (row) => row.userAgent === "OAI-SearchBot",
    );
    const gptBot = report.crawlers.find((row) => row.userAgent === "GPTBot");
    const googlebot = report.crawlers.find(
      (row) => row.userAgent === "Googlebot",
    );
    expect(searchBot).toMatchObject({
      status: "blocked",
      rule: "specific",
      tier: "search",
    });
    expect(gptBot).toMatchObject({
      status: "blocked",
      rule: "specific",
      tier: "training",
    });
    expect(googlebot).toMatchObject({
      status: "allowed",
      rule: "wildcard",
    });
  });

  it("treats an empty Disallow as allow-all", () => {
    const report = evaluateAiCrawlerAccess(`
User-agent: PerplexityBot
Disallow:
`);
    expect(
      report.crawlers.find((row) => row.userAgent === "PerplexityBot"),
    ).toMatchObject({ status: "allowed", rule: "specific" });
  });

  it("lets Allow win when it is at least as specific as Disallow", () => {
    const report = evaluateAiCrawlerAccess(`
User-agent: Googlebot
Disallow: /
Allow: /
`);
    expect(
      report.crawlers.find((row) => row.userAgent === "Googlebot"),
    ).toMatchObject({ status: "allowed", rule: "specific" });
  });
});
