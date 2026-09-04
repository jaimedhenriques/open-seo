import { createFileRoute } from "@tanstack/react-router";
import { FeaturePageTemplate } from "@/components/feature-page";
import { featurePages } from "@/lib/feature-pages";
import { buildPageSeo } from "@/lib/seo";

const page = featurePages.llmsTxt;

export const Route = createFileRoute("/_marketing/features/llms-txt")({
  head: () =>
    buildPageSeo({
      title: "llms.txt map",
      description: page.description,
      path: "/features/llms-txt",
      titleSuffix: "SearchCrew",
      imageAlt: page.imageAlt,
    }),
  component: () => <FeaturePageTemplate page={page} />,
});
