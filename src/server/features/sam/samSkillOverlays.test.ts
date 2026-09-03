import { describe, expect, it } from "vitest";
import { composeSamSkillBody } from "@/server/features/sam/samSkillOverlays";

describe("composeSamSkillBody", () => {
  it("overlays geo-crawlers onto the in-app map and research log", () => {
    const body = composeSamSkillBody(
      "geo-crawlers",
      "## Project context\n\n## Analysis Procedure\n",
    );
    const overlay = body.slice(0, body.indexOf("## Project context"));

    expect(overlay).toContain("Surface note: you are SAM");
    expect(overlay).toContain("analyze_ai_crawler_access");
    expect(overlay).toContain("no credits");
    expect(overlay).toContain("/p/<projectId>/geo-crawlers");
    expect(overlay).toContain("appendResearchLog");
    expect(overlay).toContain("GEO-CRAWLER-ACCESS.md");
    expect(overlay.toLowerCase()).not.toMatch(
      /fitch|jaime|win-rate|autumn|\$10/,
    );
    expect(body.indexOf("analyze_ai_crawler_access")).toBeLessThan(
      body.indexOf("## Analysis Procedure"),
    );
  });

  it("does not overlay unrelated public skills", () => {
    const body = composeSamSkillBody("seo-project-setup", "## Setup");
    expect(body).toContain("Surface note: you are SAM");
    expect(body).toContain("## Setup");
    expect(body).not.toContain("analyze_ai_crawler_access");
  });
});
