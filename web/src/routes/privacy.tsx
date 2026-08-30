import { createFileRoute } from "@tanstack/react-router";
import defaultMdxComponents from "fumadocs-ui/mdx";
import PrivacyContent, {
  frontmatter as privacyFrontmatter,
} from "../../content/legal/privacy.md";
import { LegalPage } from "@/components/legal-page";
import { buildPageSeo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => {
    const seo = buildPageSeo({
      title: privacyFrontmatter.title,
      description: privacyFrontmatter.description,
      path: "/privacy",
      titleSuffix: "SearchCrew",
    });
    return {
      ...seo,
      meta: [
        ...seo.meta,
        { name: "robots", content: "noindex, nofollow" },
      ],
    };
  },
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage
      title={privacyFrontmatter.title}
      description={privacyFrontmatter.description}
    >
      <PrivacyContent components={defaultMdxComponents} />
    </LegalPage>
  );
}
