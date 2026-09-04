import { describe, expect, it } from "vitest";
import {
  GEO_GTM_COPY,
  GEO_GTM_PATH,
  GEO_GTM_SIBLING,
  geoGtmCopyText,
  geoGtmCopyViolations,
} from "./geoGtmCopy";

describe("GEO GTM copy", () => {
  const text = geoGtmCopyText();

  it("publishes the public feature path", () => {
    expect(GEO_GTM_PATH).toBe("/features/ai-crawler-access");
  });

  it("says the check uses no credits and is not a $10 SKU", () => {
    expect(text.toLowerCase()).toContain("no credits");
    expect(GEO_GTM_COPY.description).toContain("$10 SKU");
    expect(GEO_GTM_COPY.description.toLowerCase()).toContain("paused");
  });

  it("keeps search crawlers distinct from training crawlers", () => {
    expect(text).toContain("OAI-SearchBot");
    expect(text).toContain("GPTBot");
    expect(text.toLowerCase()).toContain("training");
  });

  it("treats missing robots.txt as allow, not a block", () => {
    expect(text.toLowerCase()).toContain("allow-all");
  });

  it("does not claim meta tags, headers, Fitch, or a win-rate", () => {
    expect(geoGtmCopyViolations(text)).toEqual([]);
  });

  it("treats JSON-LD as optional presence, not a ranking lever", () => {
    expect(text.toLowerCase()).toContain("json-ld");
    expect(text.toLowerCase()).toContain("optional");
    expect(text.toLowerCase()).toContain("not a ranking or citation");
    expect(geoGtmCopyViolations(text)).toEqual([]);
  });

  it("points at the public llms.txt page", () => {
    expect(GEO_GTM_SIBLING.href).toBe("/features/llms-txt");
    expect(GEO_GTM_SIBLING.label).toBe("llms.txt map");
    expect(GEO_GTM_SIBLING.hint.toLowerCase()).toContain("no credits");
    expect(geoGtmCopyViolations(text)).toEqual([]);
  });
});
