import { beforeEach, describe, expect, it, vi } from "vitest";
import { analyzeAiCrawlerAccessTool } from "./analyze-ai-crawler-access";
import { makeToolContext, textContent } from "./tool-test-support";

const mocks = vi.hoisted(() => ({
  getProjectForOrganization: vi.fn(),
  fetchAiCrawlerAccess: vi.fn(),
}));

vi.mock("cloudflare:workers", () => ({ env: {} }));

vi.mock("@/server/features/projects/services/ProjectService", () => ({
  ProjectService: {
    getProjectForOrganization: mocks.getProjectForOrganization,
  },
}));

vi.mock("@/server/lib/geo/fetchAiCrawlerAccess", () => ({
  fetchAiCrawlerAccess: mocks.fetchAiCrawlerAccess,
}));

const toolContext = makeToolContext();

beforeEach(() => {
  mocks.getProjectForOrganization.mockResolvedValue({
    id: "project_1",
    domain: "example.com",
    locationCode: 2840,
    languageCode: "en",
  });
  mocks.fetchAiCrawlerAccess.mockResolvedValue({
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
    sitemapUrls: ["https://example.com/sitemap.xml"],
    contentSignals: { search: "yes" },
    pageSample: {
      url: "https://example.com/",
      status: "found",
      httpStatus: 200,
      robotsMeta: "noai",
      xRobotsTag: null,
      tokens: ["noai"],
      jsonLd: { status: "missing", blockCount: 0, types: [] },
    },
  });
});

describe("analyze_ai_crawler_access", () => {
  it("defaults to the project domain and uses no credits", async () => {
    const result = await analyzeAiCrawlerAccessTool.handler(
      { projectId: "project_1" },
      toolContext,
    );

    expect(mocks.fetchAiCrawlerAccess).toHaveBeenCalledWith("example.com");
    expect(result.structuredContent?.origin).toBe("https://example.com");
    const gptBot = result.structuredContent?.crawlers.find(
      (row) => row.userAgent === "GPTBot",
    );
    expect(gptBot).toEqual({
      userAgent: "GPTBot",
      operator: "OpenAI",
      tier: "training",
      status: "blocked",
      rule: "specific",
    });
    expect(textContent(result)).toContain("No search/retrieval crawlers");
    expect(textContent(result)).toContain("optional content map");
    expect(textContent(result)).toContain("page sample: noai");
    expect(textContent(result)).toContain(
      "json-ld: none on this page (optional)",
    );
    expect(result._meta?.creditsCharged).toBeUndefined();
  });

  it("prefers an explicit url over the project domain", async () => {
    await analyzeAiCrawlerAccessTool.handler(
      { projectId: "project_1", url: "https://docs.example.com" },
      toolContext,
    );
    expect(mocks.fetchAiCrawlerAccess).toHaveBeenCalledWith(
      "https://docs.example.com",
    );
  });

  it("rejects a project with no domain when url is omitted", async () => {
    mocks.getProjectForOrganization.mockResolvedValue({
      id: "project_1",
      domain: null,
      locationCode: 2840,
      languageCode: "en",
    });

    await expect(
      analyzeAiCrawlerAccessTool.handler(
        { projectId: "project_1" },
        toolContext,
      ),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR" });
    expect(mocks.fetchAiCrawlerAccess).not.toHaveBeenCalled();
  });
});
