import { createFileRoute } from "@tanstack/react-router";
import { FeaturePageTemplate } from "@/components/feature-page";
import { featurePages } from "@/lib/feature-pages";
import { buildPageSeo } from "@/lib/seo";

const page = featurePages.aiCrawlerAccess;

export const Route = createFileRoute("/_marketing/features/ai-crawler-access")({
  head: () =>
    buildPageSeo({
      title: "AI Crawler Access",
      description: page.description,
      path: "/features/ai-crawler-access",
      titleSuffix: "SearchCrew",
      imageAlt: page.imageAlt,
    }),
  component: () => <FeaturePageTemplate page={page} />,
});
