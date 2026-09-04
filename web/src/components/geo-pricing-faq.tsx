import {
  GEO_PRICING_FAQ_HEADING,
  GEO_PRICING_FAQ_LEAD,
  GEO_PRICING_FAQ_LINKS,
  GEO_PRICING_FAQS,
  geoPricingFaqJsonLd,
} from "@/lib/geoPricingFaq";
import { buttonVariants } from "@/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";

export function GeoPricingFaq() {
  return (
    <section className="mt-14" aria-labelledby="geo-pricing-faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(geoPricingFaqJsonLd()),
        }}
      />
      <Card className="border-[var(--color-border-subtle)] bg-white text-neutral-950 shadow-none">
        <CardHeader>
          <CardTitle id="geo-pricing-faq-heading">
            {GEO_PRICING_FAQ_HEADING}
          </CardTitle>
          <CardDescription className="text-[var(--color-brand-muted)]">
            {GEO_PRICING_FAQ_LEAD}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <dl className="flex flex-col gap-4">
            {GEO_PRICING_FAQS.map((faq) => (
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
            {GEO_PRICING_FAQ_LINKS.map((link) => (
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
