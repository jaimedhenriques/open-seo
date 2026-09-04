export const GEO_PRICING_FAQ_HEADING = "GEO checks while billing is paused";

export const GEO_PRICING_FAQ_LEAD =
  "If a hosted SEO tool stops when monthly quota hits, SearchCrew still runs crawler and llms.txt checks with no credits. Hosted billing is paused. These checks are not a $10 SKU.";

export const GEO_PRICING_FAQS = [
  {
    question: "Do AI crawler and llms.txt checks use credits?",
    answer:
      "No. They read public robots.txt and /llms.txt. They do not spend DataForSEO credits.",
  },
  {
    question: "Is there a $10 hosted SKU for these checks?",
    answer:
      "No. Public signup and payment are paused. These GEO checks are not sold as a $10 SKU. Self-host if you need them today.",
  },
  {
    question: "Does blocking a training bot hide me from AI search?",
    answer:
      "No. A training-bot block is a preference, not a ranking defect. Search crawlers and training crawlers are different rules. This is an access map, not a citation score.",
  },
] as const;

export const GEO_PRICING_FAQ_LINKS = [
  { href: "/features/ai-crawler-access", label: "Crawler access map" },
  { href: "/features/llms-txt", label: "llms.txt checker" },
] as const;

export function geoPricingFaqText(): string {
  return [
    GEO_PRICING_FAQ_HEADING,
    GEO_PRICING_FAQ_LEAD,
    ...GEO_PRICING_FAQS.map((faq) => `${faq.question} ${faq.answer}`),
    ...GEO_PRICING_FAQ_LINKS.map((link) => `${link.href} ${link.label}`),
  ].join("\n");
}

export function geoPricingFaqJsonLd(): {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: { "@type": "Answer"; text: string };
  }>;
} {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GEO_PRICING_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
