import { describe, expect, it } from "vitest";
import { composeSamSkillBody } from "@/server/features/sam/samSkillOverlays";

describe("composeSamSkillBody", () => {
  it("overlays geo-llmstxt onto the in-app check and research log", () => {
    const body = composeSamSkillBody(
      "geo-llmstxt",
      "## Project context\n\n## Analysis Mode\n",
    );
    const overlay = body.slice(0, body.indexOf("## Project context"));

    expect(overlay).toContain("Surface note: you are SAM");
    expect(overlay).toContain("analyze_llms_txt");
    expect(overlay).toContain("no credits");
    expect(overlay).toContain("/p/<projectId>/llms-txt");
    expect(overlay).toContain("appendResearchLog");
    expect(overlay).toContain("GEO-LLMSTXT-ANALYSIS.md");
    expect(overlay.toLowerCase()).not.toMatch(
      /fitch|jaime|win-rate|autumn|\$10/,
    );
    expect(body.indexOf("analyze_llms_txt")).toBeLessThan(
      body.indexOf("## Analysis Mode"),
    );
  });

  it("does not overlay unrelated public skills", () => {
    const body = composeSamSkillBody("seo-project-setup", "## Setup");
    expect(body).toContain("Surface note: you are SAM");
    expect(body).toContain("## Setup");
    expect(body).not.toContain("analyze_llms_txt");
  });
});
