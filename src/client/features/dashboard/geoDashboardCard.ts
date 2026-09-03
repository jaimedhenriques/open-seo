import { GEO_NAV_BADGE, GEO_NAV_ITEMS } from "@/client/navigation/geoNav";

export const GEO_DASHBOARD_HAS_DATA = true;

export const GEO_DASHBOARD_CARD = {
  title: "GEO",
  description:
    "Credit-free crawler and llms.txt checks. Presence is not a ranking or citation lever.",
  hint: "Uses no credits. Hosted billing is paused; these checks are not a $10 SKU.",
} as const;

export function geoDashboardLinks() {
  return GEO_NAV_ITEMS;
}

export function geoDashboardCardText(): string {
  return [
    GEO_DASHBOARD_CARD.title,
    GEO_NAV_BADGE,
    GEO_DASHBOARD_CARD.description,
    GEO_DASHBOARD_CARD.hint,
    ...GEO_NAV_ITEMS.map((item) => `${item.to} ${item.label}`),
  ].join("\n");
}
