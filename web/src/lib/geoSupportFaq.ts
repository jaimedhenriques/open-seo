export const GEO_SUPPORT_FAQ_HEADING = "GEO checks while support is paused";

export const GEO_SUPPORT_FAQ_LEAD =
  "If a hosted SEO tool hits quota, SearchCrew still maps crawler access and optional llms.txt with no credits. Hosted billing is paused. These checks are not a $10 SKU.";

export const GEO_SUPPORT_FAQS = [
  {
    question: "Can I get help if hosted signup is paused?",
    answer:
      "Public crawler and llms.txt checks still run with no credits. Owner-managed support will publish before signup and billing open. These checks are not a $10 SKU.",
  },
  {
    question: "Does a quota hit block a crawler access check?",
    answer:
      "No. They read public robots.txt and /llms.txt. They do not spend DataForSEO credits.",
  },
  {
    question: "Where are the GEO answers while support is closed?",
    answer:
      "Read the FAQ, then use the crawler access map and llms.txt checker. A training-bot block is a preference, not a ranking defect.",
  },
] as const;

export const GEO_SUPPORT_FAQ_LINKS = [
  { href: "/faq", label: "FAQ" },
  { href: "/features/ai-crawler-access", label: "Crawler access map" },
  { href: "/features/llms-txt", label: "llms.txt checker" },
] as const;

export function geoSupportFaqText(): string {
  return [
    GEO_SUPPORT_FAQ_HEADING,
    GEO_SUPPORT_FAQ_LEAD,
    ...GEO_SUPPORT_FAQS.map((faq) => `${faq.question} ${faq.answer}`),
    ...GEO_SUPPORT_FAQ_LINKS.map((link) => `${link.href} ${link.label}`),
  ].join("\n");
}

export function geoSupportFaqJsonLd(): {
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
    mainEntity: GEO_SUPPORT_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
