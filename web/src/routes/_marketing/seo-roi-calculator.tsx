import { createFileRoute } from "@tanstack/react-router";
import { SeoRoiCalculator } from "@/components/seo-roi-calculator";
import { buildPageSeo, toCanonicalUrl } from "@/lib/seo";

const PATH = "/seo-roi-calculator";

const FAQS = [
  {
    question: "How do you calculate SEO ROI?",
    answer:
      "Subtract your year-one SEO costs from the gross profit created by forecast organic customers, then divide the net impact by total SEO investment. This calculator includes monthly spend and one-time setup cost.",
  },
  {
    question: "Which SEO costs should I include?",
    answer:
      "Include content, technical work, research, tools, agency fees, freelancers and the internal time used to manage the work. Use gross profit per customer so direct delivery costs are already removed from customer value.",
  },
  {
    question: "How accurate is an SEO ROI forecast?",
    answer:
      "Accuracy depends on the traffic, conversion and margin assumptions. Use observed analytics where available, model a conservative case first and update the forecast as rankings and conversions produce real data.",
  },
  {
    question: "Does this calculator use live keyword data?",
    answer:
      "This free calculator runs entirely from the assumptions you enter. SearchCrew adds live keyword volume, difficulty, ranking and competitor data when you research the opportunities behind the forecast.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "SearchCrew SEO ROI Calculator",
      url: toCanonicalUrl(PATH),
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      description:
        "Estimate organic leads, customers, gross profit, year-one net impact, ROI and setup-cost payback from SEO assumptions.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "SEO lead forecast",
        "Year-one SEO ROI estimate",
        "Monthly net impact estimate",
        "Setup-cost payback estimate",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
};

export const Route = createFileRoute("/_marketing/seo-roi-calculator")({
  head: () =>
    buildPageSeo({
      title: "SEO ROI Calculator: Forecast Profit, Cost and Payback",
      description:
        "Estimate SEO leads, customers, gross profit, year-one ROI and payback from your traffic, conversion and cost assumptions. Free, no signup.",
      path: PATH,
      titleSuffix: "SearchCrew",
      imageAlt: "SearchCrew SEO ROI calculator",
    }),
  component: SeoRoiCalculatorPage,
});

function SeoRoiCalculatorPage() {
  return (
    <article className="mx-auto max-w-5xl">
      <header className="grid gap-8 md:grid-cols-[minmax(0,1fr)_17rem] md:items-end">
        <div>
          <p className="text-sm font-medium text-[var(--color-brand-accent)]">
            Free calculator
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-neutral-950 sm:text-5xl md:text-6xl">
            SEO ROI Calculator
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--color-brand-muted)]">
            Turn an organic traffic forecast into leads, customers, gross profit and a clear year-one return estimate.
          </p>
        </div>
        <p className="border-t border-[var(--color-border-subtle)] pt-4 text-sm leading-6 text-neutral-700 md:border-t-0 md:border-l md:pl-6 md:pt-0">
          Six assumptions. No signup. Calculations stay in your browser.
        </p>
      </header>

      <SeoRoiCalculator />

      <section className="mt-16 grid gap-8 border-t border-[var(--color-border-subtle)] pt-10 md:grid-cols-[1.05fr_0.95fr] md:gap-14">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
            A forecast you can challenge
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-[var(--color-brand-muted)]">
            Every output traces back to an assumption you can replace. Start conservatively, save the estimate, then update the inputs when Search Console and conversion data show what the work is producing.
          </p>
          <a
            href="/library/keyword-research/opportunity-sizing-forecasting"
            className="mt-5 inline-flex text-sm font-semibold text-neutral-950 underline decoration-[var(--color-brand-accent)] decoration-2 underline-offset-4"
          >
            Read the SEO forecasting guide
            <span aria-hidden="true" className="ml-1.5">
              &rarr;
            </span>
          </a>
        </div>
        <div>
          <h3 className="text-base font-semibold text-neutral-950">
            Use observed numbers where you have them
          </h3>
          <ul className="mt-4 divide-y divide-[var(--color-border-subtle)] border-y border-[var(--color-border-subtle)] text-sm leading-6 text-neutral-700">
            <li className="py-3">Search Console or analytics for organic visits</li>
            <li className="py-3">CRM data for lead and close rates</li>
            <li className="py-3">Finance data for gross profit per customer</li>
            <li className="py-3">The full production and operating cost of SEO</li>
          </ul>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="seo-roi-faq-heading">
        <h2
          id="seo-roi-faq-heading"
          className="text-3xl font-semibold tracking-tight text-neutral-950"
        >
          SEO ROI calculator FAQ
        </h2>
        <div className="mt-6 divide-y divide-[var(--color-border-subtle)] border-y border-[var(--color-border-subtle)]">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="cursor-pointer list-none pr-8 text-base font-semibold text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-accent)] focus-visible:ring-offset-4 [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-4">
                  {faq.question}
                  <span
                    aria-hidden="true"
                    className="text-xl font-normal text-[var(--color-brand-accent)] transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 max-w-3xl pr-10 text-sm leading-6 text-[var(--color-brand-muted)]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-xl bg-neutral-950 px-6 py-8 text-white md:flex md:items-end md:justify-between md:gap-10 md:px-8 md:py-10">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">
            Research the opportunities behind the forecast
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-300">
            SearchCrew puts keyword volume, difficulty, competitors, rankings and site health in one open-source workspace.
          </p>
        </div>
        <a
          href="https://app.searchcrew.ai/sign-up"
          className="mt-6 inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-accent)] px-5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-[#ff7133] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 md:mt-0"
        >
          Try SearchCrew free
          <span aria-hidden="true" className="ml-2">
            &rarr;
          </span>
        </a>
      </section>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </article>
  );
}
