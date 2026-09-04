import { createFileRoute } from "@tanstack/react-router";
import { GeoGetStartedPain } from "@/components/geo-get-started-pain";
import { buildPageSeo } from "@/lib/seo";

export const Route = createFileRoute("/_marketing/get-started")({
  head: () =>
    buildPageSeo({
      title: "Get early access",
      description:
        "See the current SearchCrew hosted-beta launch status and use the free SEO ROI calculator.",
      path: "/get-started",
      titleSuffix: "SearchCrew",
    }),
  component: GetStartedPage,
});

function GetStartedPage() {
  return (
    <article className="mx-auto max-w-4xl">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_22rem] md:items-start md:gap-16">
        <header>
          <p className="text-sm font-medium text-[var(--color-brand-accent-ink)]">
            Hosted beta
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-neutral-950 sm:text-5xl md:text-6xl">
            Hosted signup is being verified
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--color-brand-muted)]">
            The marketing tools and SEO ROI calculator are live. Public hosted
            accounts will open after production authentication, billing,
            support, and legal ownership have been verified end to end.
          </p>

          <div className="mt-8 grid gap-0 border-y border-[var(--color-border-subtle)] text-sm text-neutral-700">
            <div className="grid grid-cols-[2rem_1fr] gap-3 py-4">
              <span className="font-mono text-xs text-[var(--color-brand-accent-ink)]">
                01
              </span>
              <span>Production app and custom-domain health confirmed.</span>
            </div>
            <div className="grid grid-cols-[2rem_1fr] gap-3 border-t border-[var(--color-border-subtle)] py-4">
              <span className="font-mono text-xs text-[var(--color-brand-accent-ink)]">
                02
              </span>
              <span>Signup, onboarding, and account recovery tested.</span>
            </div>
            <div className="grid grid-cols-[2rem_1fr] gap-3 border-t border-[var(--color-border-subtle)] py-4">
              <span className="font-mono text-xs text-[var(--color-brand-accent-ink)]">
                03
              </span>
              <span>Billing, support, and legal identity published and tested.</span>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-sm shadow-neutral-900/5 sm:p-7">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
            Public accounts are paused
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-brand-muted)]">
            No email or payment is collected on this page. Use the free
            calculator now, or review the published plan structure.
          </p>
          <div className="mt-5 grid gap-2">
            <a
              href="/seo-roi-calculator"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-neutral-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-accent)] focus-visible:ring-offset-2"
            >
              Calculate your SEO return
            </a>
            <a
              href="/pricing"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--color-border-subtle)] px-4 text-sm font-semibold text-neutral-950 transition-colors hover:border-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-accent)] focus-visible:ring-offset-2"
            >
              Review pricing
            </a>
          </div>
        </section>
      </div>
      <GeoGetStartedPain />
    </article>
  );
}
