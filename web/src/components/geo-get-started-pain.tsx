import {
  GEO_GET_STARTED_PAIN_HEADING,
  GEO_GET_STARTED_PAIN_LEAD,
  GEO_GET_STARTED_PAIN_LINKS,
} from "@/lib/geoGetStartedPain";
import { buttonVariants } from "@/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";

export function GeoGetStartedPain() {
  return (
    <section className="mt-12" aria-labelledby="geo-get-started-pain-heading">
      <Card className="border-[var(--color-border-subtle)] bg-white text-neutral-950 shadow-none">
        <CardHeader>
          <CardTitle id="geo-get-started-pain-heading">
            {GEO_GET_STARTED_PAIN_HEADING}
          </CardTitle>
          <CardDescription className="text-[var(--color-brand-muted)]">
            {GEO_GET_STARTED_PAIN_LEAD}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {GEO_GET_STARTED_PAIN_LINKS.map((link) => (
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
        </CardContent>
      </Card>
    </section>
  );
}
