export type GeoSurface = "crawlers" | "llms-txt";

type GeoSiblingLink = {
  to: "/p/$projectId/geo-crawlers" | "/p/$projectId/llms-txt";
  label: string;
  hint: string;
};

export function geoSiblingLink(from: GeoSurface): GeoSiblingLink {
  if (from === "crawlers") {
    return {
      to: "/p/$projectId/llms-txt",
      label: "Check llms.txt",
      hint: "Optional content map. Uses no credits.",
    };
  }
  return {
    to: "/p/$projectId/geo-crawlers",
    label: "Check AI crawlers",
    hint: "robots.txt access map. Uses no credits.",
  };
}
