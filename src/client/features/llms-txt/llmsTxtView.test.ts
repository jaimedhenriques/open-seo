import { describe, expect, it } from "vitest";
import { canSubmitUrl, summarizeLlmsTxt } from "./llmsTxtView";
import type { LlmsTxtReport } from "@/server/lib/geo/llmsTxt";

function report(overrides: Partial<LlmsTxtReport> = {}): LlmsTxtReport {
  return {
    origin: "https://example.com",
    url: "https://example.com/llms.txt",
    fetchStatus: "found",
    httpStatus: 200,
    title: "Example",
    description: "Widgets for shops.",
    sections: [
      {
        heading: "Docs",
        entries: [
          {
            title: "Home",
            url: "https://example.com/",
            description: "Landing page",
            absolute: true,
          },
        ],
      },
    ],
    checks: [
      { id: "title", label: "H1 title", status: "pass", detail: "Example" },
      {
        id: "urls",
        label: "Absolute URLs",
        status: "pass",
        detail: "All listed URLs are absolute.",
      },
    ],
    ...overrides,
  };
}

describe("llmsTxtView", () => {
  it("treats a missing file as optional, not a ranking defect", () => {
    const summary = summarizeLlmsTxt(
      report({
        fetchStatus: "missing",
        httpStatus: 404,
        title: null,
        description: null,
        sections: [],
        checks: [],
      }),
    );
    expect(summary.statusLabel).toBe("Not published");
    expect(summary.headline).toContain("Optional file");
    expect(summary.headline.toLowerCase()).not.toMatch(
      /fitch|jaime|win-rate|autumn|\$10/,
    );
  });

  it("counts pages on a found file", () => {
    const summary = summarizeLlmsTxt(report());
    expect(summary.pageCount).toBe(1);
    expect(summary.failCount).toBe(0);
    expect(canSubmitUrl("example.com")).toBe(true);
    expect(canSubmitUrl("  ")).toBe(false);
  });
});
