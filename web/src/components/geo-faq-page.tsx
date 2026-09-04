import {
  GEO_FAQ_PAGE_HEADING,
  GEO_FAQ_PAGE_LEAD,
  GEO_FAQ_PAGE_LINKS,
  GEO_FAQ_PAGE_FAQS,
  geoFaqPageJsonLd,
} from "@/lib/geoFaqPage";
import { buttonVariants } from "@/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";

export function GeoFaqPage() {
  return (
    <section className="mt-12" aria-labelledby="geo-faq-page-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(geoFaqPageJsonLd()),
        }}
      />
      <Card className="border-[var(--color-border-subtle)] bg-white text-neutral-950 shadow-none">
        <CardHeader>
          <CardTitle id="geo-faq-page-heading">
            {GEO_FAQ_PAGE_HEADING}
          </CardTitle>
          <CardDescription className="text-[var(--color-brand-muted)]">
            {GEO_FAQ_PAGE_LEAD}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <dl className="flex flex-col gap-4">
            {GEO_FAQ_PAGE_FAQS.map((faq) => (
              <div key={faq.question}>
                <dt className="text-sm font-medium text-neutral-950">
                  {faq.question}
                </dt>
                <dd className="mt-1.5 text-sm leading-6 text-[var(--color-brand-muted)]">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap gap-3">
            {GEO_FAQ_PAGE_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "border-[var(--color-border-subtle)] bg-white text-neutral-950 no-underline",
                })}
              >
                {link.label}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
