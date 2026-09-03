export const GEO_GET_STARTED_PAIN_HEADING =
  "Quota should not stop a crawler check";

export const GEO_GET_STARTED_PAIN_LEAD =
  "If a hosted SEO tool hits its monthly quota, SearchCrew still maps AI crawler access and optional llms.txt with no credits. Hosted billing is paused. These checks are not a $10 SKU.";

export const GEO_GET_STARTED_PAIN_LINKS = [
  { href: "/features/ai-crawler-access", label: "Crawler access map" },
  { href: "/features/llms-txt", label: "llms.txt checker" },
] as const;

export function geoGetStartedPainText(): string {
  return [
    GEO_GET_STARTED_PAIN_HEADING,
    GEO_GET_STARTED_PAIN_LEAD,
    ...GEO_GET_STARTED_PAIN_LINKS.map((link) => `${link.href} ${link.label}`),
  ].join("\n");
}
