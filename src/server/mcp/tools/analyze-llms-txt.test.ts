import { beforeEach, describe, expect, it, vi } from "vitest";
import { analyzeLlmsTxtTool } from "./analyze-llms-txt";
import { makeToolContext, textContent } from "./tool-test-support";

const mocks = vi.hoisted(() => ({
  getProjectForOrganization: vi.fn(),
  fetchLlmsTxt: vi.fn(),
}));

vi.mock("cloudflare:workers", () => ({ env: {} }));

vi.mock("@/server/features/projects/services/ProjectService", () => ({
  ProjectService: {
    getProjectForOrganization: mocks.getProjectForOrganization,
  },
}));

vi.mock("@/server/lib/geo/fetchAiCrawlerAccess", () => ({
  fetchLlmsTxt: mocks.fetchLlmsTxt,
}));

const toolContext = makeToolContext();

beforeEach(() => {
  mocks.getProjectForOrganization.mockResolvedValue({
    id: "project_1",
    domain: "example.com",
    locationCode: 2840,
    languageCode: "en",
  });
  mocks.fetchLlmsTxt.mockResolvedValue({
    origin: "https://example.com",
    url: "https://example.com/llms.txt",
    fetchStatus: "missing",
    httpStatus: 404,
    title: null,
    description: null,
    sections: [],
    checks: [],
  });
});

describe("analyze_llms_txt", () => {
  it("defaults to the project domain and uses no credits", async () => {
    const result = await analyzeLlmsTxtTool.handler(
      { projectId: "project_1" },
      toolContext,
    );

    expect(mocks.fetchLlmsTxt).toHaveBeenCalledWith("example.com");
    expect(textContent(result)).toContain("Optional file");
    expect(result._meta?.creditsCharged).toBeUndefined();
    expect(result._meta?.url).toBe(
      "https://searchcrew.test/p/project_1/llms-txt",
    );
  });
});
