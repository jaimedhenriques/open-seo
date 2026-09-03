import { describe, expect, it } from "vitest";
import { GEO_LANDING_CARDS, geoLandingCopyText } from "./geoLandingCopy";

describe("GEO homepage feature cards", () => {
  it("links the public crawler and llms.txt feature pages", () => {
    expect(GEO_LANDING_CARDS.map((card) => card.href)).toEqual([
      "/features/ai-crawler-access",
      "/features/llms-txt",
    ]);
    expect(GEO_LANDING_CARDS.map((card) => card.slug)).toEqual([
      "ai-crawler-access",
      "llms-txt",
    ]);
  });

  it("says both checks use no credits and does not claim a ranking lever", () => {
    const text = geoLandingCopyText().toLowerCase();
    expect(text).toContain("no credits");
    expect(GEO_LANDING_CARDS[0]?.blurb.toLowerCase()).toContain("no credits");
    expect(GEO_LANDING_CARDS[1]?.blurb.toLowerCase()).toContain("optional");
    expect(text).not.toMatch(/ranking|citation|win-rate/);
  });

  it("does not use Fitch, Jaime, Autumn, or a $10 SKU in homepage blurbs", () => {
    const text = geoLandingCopyText().toLowerCase();
    expect(text).not.toMatch(/fitch|jaime|autumn|\$10/);
  });
});
