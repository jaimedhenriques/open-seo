export const GEO_LANDING_SECTION_HEADING =
  "Credit-free crawler and llms.txt checks";

export const GEO_LANDING_SECTION_LEAD =
  "See which named AI search crawlers robots.txt allows, and whether /llms.txt exists. Uses no credits. Presence is not a ranking or citation lever. Hosted billing is paused; these checks are not a $10 SKU.";

export const GEO_LANDING_SECTION_CARDS = [
  {
    href: "/features/ai-crawler-access",
    title: "AI crawler access",
    blurb: "See which named AI crawlers robots.txt allows. Uses no credits.",
    cta: "Check crawler access",
  },
  {
    href: "/features/llms-txt",
    title: "llms.txt map",
    blurb: "Check /llms.txt format. Optional file. Uses no credits.",
    cta: "Check llms.txt",
  },
] as const;

export function geoLandingSectionText(): string {
  return [
    GEO_LANDING_SECTION_HEADING,
    GEO_LANDING_SECTION_LEAD,
    ...GEO_LANDING_SECTION_CARDS.map(
      (card) => `${card.href} ${card.title} ${card.blurb} ${card.cta}`,
    ),
  ].join("\n");
}
