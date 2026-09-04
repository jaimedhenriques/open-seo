export const GEO_LANDING_CARDS = [
  {
    href: "/features/ai-crawler-access",
    slug: "ai-crawler-access",
    blurb: "See which named AI crawlers robots.txt allows. Uses no credits.",
  },
  {
    href: "/features/llms-txt",
    slug: "llms-txt",
    blurb: "Check /llms.txt format. Optional file. Uses no credits.",
  },
] as const;

export function geoLandingCopyText(): string {
  return GEO_LANDING_CARDS.map(
    (card) => `${card.href} ${card.slug} ${card.blurb}`,
  ).join("\n");
}
