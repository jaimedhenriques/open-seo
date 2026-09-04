export const LLMS_GTM_PATH = "/features/llms-txt";

export const LLMS_GTM_SIBLING = {
  label: "AI crawler access",
  href: "/features/ai-crawler-access",
  hint: "robots.txt access map. Uses no credits.",
} as const;

export const LLMS_GTM_COPY = {
  eyebrow: "llms.txt map",
  navDescription: "Check the optional /llms.txt content map.",
  title: "llms.txt: an optional map, not a ranking lever",
  description:
    "Read public /llms.txt and check title, sections, and absolute URLs. Uses no credits. A missing file is optional, not a ranking defect. Hosted billing is paused; this check is not a $10 SKU.",
  workflows: [
    {
      title: "Fetch /llms.txt only",
      description:
        "SearchCrew requests the site's /llms.txt. It does not crawl the rest of the site for this check.",
    },
    {
      title: "Check format, not ranking",
      description:
        "The report looks for an H1, a one-line summary, H2 sections, listed pages, and full https:// URLs. That is format, not a citation score.",
    },
    {
      title: "Run it in the app or through MCP",
      description:
        "The same credit-free check is available in a SearchCrew project and as analyze_llms_txt for Squadbots and other MCP clients.",
    },
  ],
  useCases: [
    "See whether /llms.txt exists before you treat it as required GEO work.",
    "Catch relative links in an existing llms.txt without spending credits.",
  ],
  differentiators: [
    "No credits for this check. Pay is paused and there is no hosted $10 SKU.",
    "Missing llms.txt is optional. Publishing one is not a ranking or citation prediction.",
  ],
  faqs: [
    {
      question: "Does this use SearchCrew credits?",
      answer:
        "No. The llms.txt check reads one public file and does not spend DataForSEO credits.",
    },
    {
      question: "Is a missing llms.txt a problem?",
      answer:
        "No. The file is optional. Google does not require it for AI Overviews. Absence is not a ranking defect.",
    },
    {
      question: "Does publishing llms.txt improve AI rankings?",
      answer:
        "This report does not claim that. It is a format check for an optional content map.",
    },
    {
      question: "What does this cost?",
      answer:
        "Hosted billing is paused. This check is not sold as a $10 SKU. Self-host if you need it today.",
    },
  ],
} as const;

const BANNED = ["fitch", "jaime", "win-rate", "win rate", "autumn product"];

export function llmsGtmCopyViolations(text: string): string[] {
  const haystack = text.toLowerCase();
  return BANNED.filter((term) => haystack.includes(term));
}

export function llmsGtmCopyText(): string {
  const faqs = LLMS_GTM_COPY.faqs.map((faq) => `${faq.question} ${faq.answer}`);
  return [
    LLMS_GTM_COPY.title,
    LLMS_GTM_COPY.description,
    ...LLMS_GTM_COPY.workflows.map(
      (item) => `${item.title} ${item.description}`,
    ),
    ...LLMS_GTM_COPY.useCases,
    ...LLMS_GTM_COPY.differentiators,
    ...faqs,
    LLMS_GTM_SIBLING.label,
    LLMS_GTM_SIBLING.href,
    LLMS_GTM_SIBLING.hint,
  ].join("\n");
}
