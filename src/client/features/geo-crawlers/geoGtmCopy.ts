export const GEO_GTM_PATH = "/features/ai-crawler-access";

export const GEO_GTM_COPY = {
  eyebrow: "AI crawler access",
  navDescription: "See which named AI search crawlers robots.txt allows.",
  title: "AI crawler access: which bots can read your site",
  description:
    "Check named AI search crawlers against robots.txt. Uses no credits. Training-bot blocks are a preference, not a ranking defect. Hosted billing is paused; this check is not a $10 SKU.",
  workflows: [
    {
      title: "Check robots.txt",
      description:
        "SearchCrew fetches public robots.txt and maps named crawlers such as OAI-SearchBot, Claude-SearchBot, PerplexityBot, and Googlebot.",
    },
    {
      title: "Separate search from training",
      description:
        "A GPTBot block does not by itself remove you from ChatGPT Search. Search crawlers and training crawlers are different rules.",
    },
    {
      title: "Run it in the app or through MCP",
      description:
        "The same credit-free check is available in a SearchCrew project and as analyze_ai_crawler_access for Squadbots and other MCP clients.",
    },
    {
      title: "Sample JSON-LD on the checked URL",
      description:
        "The same check lists application/ld+json types from that page. Missing JSON-LD is optional. Presence is not a ranking or citation lever.",
    },
  ],
  useCases: [
    "See whether ChatGPT Search, Claude, Perplexity, or Googlebot is blocked before you rewrite pages for AI answers.",
    "Confirm a training-bot block is intentional instead of treating it as a defect.",
    "See which JSON-LD types the checked URL publishes, without treating a missing block as a defect.",
  ],
  differentiators: [
    "No credits for this check. Pay is paused and there is no hosted $10 SKU.",
    "This report is an access map, not a ranking or citation prediction.",
  ],
  faqs: [
    {
      question: "Does this use SearchCrew credits?",
      answer:
        "No. The crawler-access check reads public robots.txt and does not spend DataForSEO credits.",
    },
    {
      question: "If I block GPTBot, am I hidden from ChatGPT Search?",
      answer:
        "No. GPTBot is a training crawler. ChatGPT Search uses OAI-SearchBot. Allow or block them separately.",
    },
    {
      question: "Does missing robots.txt block AI crawlers?",
      answer:
        "No. Missing robots.txt, or an empty Disallow, is treated as allow-all for the named crawlers in this report.",
    },
    {
      question: "What does this cost?",
      answer:
        "Hosted billing is paused. This check is not sold as a $10 SKU. Self-host if you need it today.",
    },
    {
      question: "Does missing JSON-LD fail this check?",
      answer:
        "No. JSON-LD is optional. The report lists types when they exist. That is presence, not a ranking or citation score.",
    },
  ],
} as const;

const BANNED = [
  "fitch",
  "win-rate",
  "win rate",
  "autumn product",
  "meta tags",
  "http headers",
  "x-robots-tag",
];

export function geoGtmCopyViolations(text: string): string[] {
  const haystack = text.toLowerCase();
  return BANNED.filter((term) => haystack.includes(term));
}

export function geoGtmCopyText(): string {
  const faqs = GEO_GTM_COPY.faqs.map((faq) => `${faq.question} ${faq.answer}`);
  return [
    GEO_GTM_COPY.title,
    GEO_GTM_COPY.description,
    ...GEO_GTM_COPY.workflows.map(
      (item) => `${item.title} ${item.description}`,
    ),
    ...GEO_GTM_COPY.useCases,
    ...GEO_GTM_COPY.differentiators,
    ...faqs,
  ].join("\n");
}
