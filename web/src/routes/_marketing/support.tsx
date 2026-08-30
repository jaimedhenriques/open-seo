import { createFileRoute } from "@tanstack/react-router";
import { buildPageSeo } from "@/lib/seo";

export const Route = createFileRoute("/_marketing/support")({
  head: () =>
    buildPageSeo({
      title: "Support",
      description:
        "SearchCrew support information for the hosted beta and public tools.",
      path: "/support",
      titleSuffix: "SearchCrew",
    }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <article className="mx-auto max-w-4xl">
      <header className="max-w-3xl">
        <p className="text-sm font-medium text-[var(--color-brand-accent-ink)]">
          Support
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-neutral-950 md:text-6xl">
          Hosted beta support is opening soon
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--color-brand-muted)]">
          SearchCrew hosted accounts are not open yet. An owner-managed support
          channel will be published before public signup and billing open.
        </p>
      </header>

      <section className="mt-12 border-y border-[var(--color-border-subtle)] py-8 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-10">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
            Need launch access?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-brand-muted)]">
            Follow the launch checklist for account and support availability.
            No waitlist or email address is collected yet. The SEO ROI
            calculator remains free and does not require an account.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 md:mt-0">
          <a
            href="/get-started"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-neutral-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-accent)] focus-visible:ring-offset-2"
          >
            View launch status
          </a>
          <a
            href="/seo-roi-calculator"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--color-border-subtle)] px-5 text-sm font-semibold text-neutral-950 transition-colors hover:border-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-accent)] focus-visible:ring-offset-2"
          >
            Use the calculator
          </a>
        </div>
      </section>
    </article>
  );
}
