import { featurePages } from "@/lib/feature-pages";

export const LANDING_FEATURE_CARDS = [
  {
    page: featurePages.keywordResearch,
    blurb: "Find ideas, demand, difficulty, intent, and live SERPs.",
  },
  {
    page: featurePages.rankTracking,
    blurb: "Track keyword positions over time.",
  },
  {
    page: featurePages.siteAudit,
    blurb: "Crawl pages and surface technical issues.",
  },
  {
    page: featurePages.aiCrawlerAccess,
    blurb: "See which named AI crawlers robots.txt allows. Uses no credits.",
  },
  {
    page: featurePages.llmsTxt,
    blurb: "Check /llms.txt format. Optional file. Uses no credits.",
  },
] as const;
