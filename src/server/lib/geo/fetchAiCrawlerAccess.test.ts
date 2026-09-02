import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchAiCrawlerAccess } from "./fetchAiCrawlerAccess";

function jsonDns(status = 0) {
  return new Response(JSON.stringify({ Status: status, Answer: [] }), {
    status: 200,
    headers: { "content-type": "application/dns-json" },
  });
}

describe("fetchAiCrawlerAccess", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("maps a public robots.txt and a missing llms.txt", async () => {
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : input.url;
      if (url.includes("cloudflare-dns.com")) return jsonDns();
      if (url.endsWith("/robots.txt")) {
        return new Response("User-agent: GPTBot\nDisallow: /\n", {
          status: 200,
        });
      }
      if (url.endsWith("/llms.txt")) {
        return new Response("not found", { status: 404 });
      }
      return new Response("nope", { status: 500 });
    });

    const report = await fetchAiCrawlerAccess("example.com");
    expect(report.origin).toBe("https://example.com");
    expect(report.robotsTxt.status).toBe("found");
    expect(report.llmsTxt.status).toBe("missing");
    expect(
      report.crawlers.find((row) => row.userAgent === "GPTBot"),
    ).toMatchObject({ status: "blocked", rule: "specific" });
    expect(
      report.crawlers.find((row) => row.userAgent === "Googlebot"),
    ).toMatchObject({ status: "allowed", rule: "default" });
  });
});
