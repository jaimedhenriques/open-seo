import { describe, expect, it } from "vitest";
import {
  LLMS_GTM_COPY,
  LLMS_GTM_PATH,
  LLMS_GTM_SIBLING,
  llmsGtmCopyText,
  llmsGtmCopyViolations,
} from "./llmsGtmCopy";

describe("llms.txt GTM copy", () => {
  const text = llmsGtmCopyText();

  it("publishes the public feature path", () => {
    expect(LLMS_GTM_PATH).toBe("/features/llms-txt");
  });

  it("says the check uses no credits and is not a $10 SKU", () => {
    expect(text.toLowerCase()).toContain("no credits");
    expect(LLMS_GTM_COPY.description).toContain("$10 SKU");
    expect(LLMS_GTM_COPY.description.toLowerCase()).toContain("paused");
  });

  it("treats a missing file as optional", () => {
    expect(text.toLowerCase()).toContain("optional");
    expect(text.toLowerCase()).toContain("not a ranking defect");
  });

  it("points at the in-app check and MCP tool", () => {
    expect(text).toContain("analyze_llms_txt");
  });

  it("does not claim Fitch, Jaime, a win-rate, or an Autumn product", () => {
    expect(llmsGtmCopyViolations(text)).toEqual([]);
  });

  it("points at the public crawler-access page", () => {
    expect(LLMS_GTM_SIBLING.href).toBe("/features/ai-crawler-access");
    expect(LLMS_GTM_SIBLING.label).toBe("AI crawler access");
    expect(LLMS_GTM_SIBLING.hint.toLowerCase()).toContain("no credits");
    expect(llmsGtmCopyViolations(text)).toEqual([]);
  });
});
