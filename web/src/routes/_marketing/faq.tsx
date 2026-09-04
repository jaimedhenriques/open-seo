import { createFileRoute } from "@tanstack/react-router";
import { GeoFaqPage } from "@/components/geo-faq-page";
import { buildPageSeo } from "@/lib/seo";

export const Route = createFileRoute("/_marketing/faq")({
  head: () =>
    buildPageSeo({
      title: "FAQ",
      description:
        "Answers for SearchCrew crawler and llms.txt checks: quota, credits, paused billing, and training-bot blocks.",
      path: "/faq",
      titleSuffix: "SearchCrew",
    }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <article className="mx-auto max-w-4xl">
      <header className="max-w-3xl">
        <p className="text-sm font-medium text-[var(--color-brand-accent-ink)]">
          FAQ
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-neutral-950 md:text-6xl">
          Crawler and llms.txt checks
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--color-brand-muted)]">
          Public hosted signup is paused. These answers cover the credit-free
          crawler access map and optional llms.txt checker.
        </p>
      </header>
      <GeoFaqPage />
    </article>
  );
}
