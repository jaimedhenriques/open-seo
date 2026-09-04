import { describe, expect, it } from "vitest";
import { parseJsonLdSample } from "./jsonLd";

describe("parseJsonLdSample", () => {
  it("reports missing when the page has no JSON-LD script", () => {
    const sample = parseJsonLdSample("<html><p>hello</p></html>");
    expect(sample).toEqual({ status: "missing", blockCount: 0, types: [] });
  });

  it("reads @type from a single JSON-LD block", () => {
    const html = `<html><script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Example"}</script></html>`;
    const sample = parseJsonLdSample(html);
    expect(sample.status).toBe("found");
    expect(sample.blockCount).toBe(1);
    expect(sample.types).toEqual(["Organization"]);
  });

  it("reads @graph types", () => {
    const html = `<script type="application/ld+json">{"@graph":[{"@type":"WebSite"},{"@type":"Organization"}]}</script>`;
    expect(parseJsonLdSample(html).types).toEqual(["Organization", "WebSite"]);
  });

  it("reads an array of @type values", () => {
    const html = `<script type="application/ld+json">{"@type":["Organization","LocalBusiness"]}</script>`;
    expect(parseJsonLdSample(html).types).toEqual([
      "LocalBusiness",
      "Organization",
    ]);
  });

  it("marks unparseable JSON-LD as invalid", () => {
    const html = `<script type="application/ld+json">{not json}</script>`;
    expect(parseJsonLdSample(html)).toEqual({
      status: "invalid",
      blockCount: 1,
      types: [],
    });
  });

  it("does not claim Fitch, a win-rate, or a $10 SKU", () => {
    const html = `<script type="application/ld+json">{"@type":"Organization"}</script>`;
    const sample = parseJsonLdSample(html);
    const text = `${sample.status} ${sample.types.join(" ")}`;
    expect(text.toLowerCase()).not.toMatch(/fitch|jaime|win-rate|autumn|\$10/);
  });
});
