import { FEATURE_PAGE_SLUGS } from "@/lib/feature-page-slugs";

export type FeaturePage = {
  slug: string;
  eyebrow: string;
  navDescription: string;
  title: string;
  description: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  imageAlt: string;
  imageSrc: string;
  imageWidth?: number;
  imageHeight?: number;
  imageCaption?: string;
  workflows: Array<{
    title: string;
    description: string;
  }>;
  metrics: Array<{
    label: string;
    value: string;
  }>;
  showMetrics?: boolean;
  useCases: string[];
  differentiators: string[];
  featuredLink?: {
    title: string;
    description: string;
    href: string;
  };
  related: Array<{
    label: string;
    href: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  guides?: {
    title: string;
    description: string;
    items: Array<{
      label: string;
      description: string;
      href: string;
    }>;
    cta: {
      label: string;
      href: string;
    };
  };
};

export const featurePages = {
  keywordResearch: {
    slug: FEATURE_PAGE_SLUGS.keywordResearch,
    eyebrow: "Keyword Research",
    navDescription: "Find keyword ideas and SERPs.",
    title: "Keyword research tool for practical SEO planning",
    description:
      "Find keyword ideas, compare search volume and difficulty, inspect SERP results, and save the opportunities worth building around.",
    primaryKeyword: "keyword research tool",
    secondaryKeywords: [
      "seo keyword research tool",
      "free keyword research tool",
      "keyword research tools",
    ],
    imageAlt: "SearchCrew keyword research dashboard",
    imageSrc: "/screenshots/keyword-research.png",
    imageWidth: 1052,
    imageHeight: 768,
    workflows: [
      {
        title: "Research seed topics",
        description:
          "Start with one or more seeds and expand them into keyword ideas with volume, difficulty, CPC, and intent signals.",
      },
      {
        title: "Inspect the real SERP",
        description:
          "Open SERP results beside keyword metrics so content decisions are based on the pages ranking for that query.",
      },
      {
        title: "Save and organize opportunities",
        description:
          "Keep useful keywords in your workspace and tag them for content planning, rank tracking, or AI-agent workflows.",
      },
    ],
    metrics: [
      { label: "Search volume", value: "Demand" },
      { label: "Keyword difficulty", value: "Competition" },
      { label: "CPC", value: "Commercial signal" },
      { label: "SERP results", value: "Search context" },
    ],
    showMetrics: true,
    useCases: [
      "Build a content roadmap from real keyword data.",
      "Find lower-competition variants before writing.",
      "Group keywords for articles, landing pages, and rank tracking.",
    ],
    differentiators: [
      "SEO workflows your team and your agents share the same context on.",
      "DataForSEO-backed metrics without locking the research process into a black box.",
      "MCP access so AI agents can research and save keywords for you.",
    ],
    related: [
      { label: "Keyword Clustering", href: "/docs/skills/keyword-clustering" },
      {
        label: "Keyword Research",
        href: "/docs/skills/keyword-research",
      },
      { label: "Rank Tracking", href: "/features/rank-tracking" },
    ],
    faqs: [
      {
        question: "What is SearchCrew keyword research best for?",
        answer:
          "SearchCrew is best for finding SEO keyword ideas, checking demand and difficulty, and turning those ideas into saved keywords you can revisit.",
      },
      {
        question: "Can I use SearchCrew as a free keyword research tool?",
        answer:
          "Not unlimited: quality keyword data costs money everywhere, which is why the big SEO suites run $100/month and up. SearchCrew's proposed hosted tiers include usage credits, while billing remains paused. You can also self-host with your own DataForSEO account.",
      },
      {
        question: "Does SearchCrew show live search results?",
        answer:
          "Yes. Keyword research can be paired with SERP inspection so you can see ranking pages alongside the metrics.",
      },
    ],
    guides: {
      title: "The Keyword Research Strategy Library",
      description:
        "Practitioner strategies for using keyword research to discover demand. Each guide includes a full walkthrough and a copy-paste MCP prompt.",
      items: [
        {
          label: "Seed from conversation, not a volume report",
          description:
            "Harvest seed keywords from sales calls and support tickets.",
          href: "/library/keyword-research/seed-from-conversation",
        },
        {
          label: "What are long-tail keywords, and how to mine them",
          description:
            "PAA fan-out, autocomplete harvesting, and your own GSC queries.",
          href: "/library/keyword-research/long-tail-question-mining",
        },
        {
          label: "Search-intent mapping (hot / warm / cold)",
          description: "Sort keywords by buying temperature before you write.",
          href: "/library/keyword-research/search-intent-mapping",
        },
        {
          label: "Cluster keywords into topical hubs",
          description:
            "One page per intent, plus the keyword cannibalization fix.",
          href: "/library/keyword-research/cluster-topical-hubs",
        },
      ],
      cta: {
        label: "Browse all keyword research strategies",
        href: "/library/keyword-research",
      },
    },
  },
  siteAudit: {
    slug: FEATURE_PAGE_SLUGS.siteAudit,
    eyebrow: "Site Audit",
    navDescription: "Audit page-level SEO signals.",
    title: "SEO audit tool for finding technical issues fast",
    description:
      "Crawl a site, collect page-level technical signals, and optionally run Lighthouse checks for performance, SEO, accessibility, and best-practice issues.",
    primaryKeyword: "seo audit tool",
    secondaryKeywords: [
      "seo site audit",
      "free seo audit tool",
      "seo audit tools",
    ],
    imageAlt: "SearchCrew site audit report",
    imageSrc: "/screenshots/site-audit.png",
    imageWidth: 1051,
    imageHeight: 768,
    workflows: [
      {
        title: "Run a site crawl",
        description:
          "Inspect pages for status codes, titles, meta descriptions, headings, indexability signals, image alt coverage, links, response time, and optional Lighthouse findings.",
      },
      {
        title: "Prioritize issues",
        description:
          "Review crawled pages and optional Lighthouse results so the team can focus on visible page and performance problems.",
      },
      {
        title: "Drill into affected URLs",
        description:
          "Move into URLs with missing titles, metadata, heading and image-alt signals, status-code issues, response-time data, or optional Lighthouse findings.",
      },
    ],
    metrics: [
      { label: "Crawled URLs", value: "Coverage" },
      { label: "Page fields", value: "Checks" },
      { label: "Affected pages", value: "Scope" },
      { label: "Audit history", value: "Progress" },
    ],
    showMetrics: true,
    useCases: [
      "Audit a new site before publishing SEO work.",
      "Find technical issues after a migration or redesign.",
      "Export crawled page data and Lighthouse findings for developers and content teams.",
    ],
    differentiators: [
      "A practical crawler built into the same workspace as keyword and domain research.",
      "A transparent audit flow — every issue traces back to the page and rule that raised it.",
      "Simple reports that expose page-level signals and optional Lighthouse findings instead of relying only on a generic score.",
    ],
    related: [
      { label: "Domain Overview", href: "/features/domain-overview" },
      { label: "Backlinks", href: "/features/backlink-checker" },
      { label: "Keyword Research", href: "/features/keyword-research" },
    ],
    faqs: [
      {
        question: "What does the SearchCrew site audit tool check?",
        answer:
          "Status codes, titles, meta descriptions, headings, indexability signals, image alt coverage, links, and response time for every crawled page. Enable Lighthouse and each page also gets performance, SEO, accessibility, and best-practice issues.",
      },
      {
        question: "Is SearchCrew a free SEO audit tool?",
        answer:
          "For smaller sites, yes: the free plan includes site audits up to 50 pages per crawl. Larger crawls need a paid plan, starting at $29/month. SearchCrew is also self-hostable.",
      },
      {
        question: "Who should use SearchCrew Site Audit?",
        answer:
          "It is useful for founders, marketers, agencies, and developers who need a shared crawl report and optional Lighthouse issue export.",
      },
    ],
  },
  backlinks: {
    slug: FEATURE_PAGE_SLUGS.backlinks,
    eyebrow: "Backlinks",
    navDescription: "Check links and referring domains.",
    title: "Backlink checker for understanding a domain's link profile",
    description:
      "Analyze backlinks, referring domains, and linked pages without separating link research from the rest of your SEO workspace.",
    primaryKeyword: "backlink analysis",
    secondaryKeywords: [
      "backlink analysis tool",
      "referring domains",
      "link profile",
    ],
    imageAlt: "SearchCrew backlinks report",
    imageSrc: "/screenshots/backlinks.png",
    imageWidth: 1053,
    imageHeight: 768,
    workflows: [
      {
        title: "Check a domain's backlinks",
        description:
          "Look up backlinks and referring-domain signals for your site, competitors, or pages you are evaluating.",
      },
      {
        title: "Compare link quality",
        description:
          "Use backlink rows, referring-domain rows, rank, spam, broken, lost, and nofollow signals to inspect link quality.",
      },
      {
        title: "Filter and export link data",
        description:
          "Export and filter backlink, referring-domain, and top-page data for your own outreach, competitor research, or cleanup review.",
      },
    ],
    metrics: [
      { label: "Backlinks", value: "Links" },
      { label: "Referring domains", value: "Sources" },
      { label: "Target URLs", value: "Distribution" },
      { label: "Rank and spam signals", value: "Quality context" },
    ],
    showMetrics: true,
    useCases: [
      "See who links to a competitor.",
      "Inspect link opportunities for important pages.",
      "Understand whether a domain has real authority before investing in content.",
    ],
    differentiators: [
      "Backlink analysis sits beside keyword research, domain overview, and audit data.",
      "Self-host or adapt backlink reporting for your team's workflow.",
      "MCP support lets an AI agent pull backlink context during SEO research.",
    ],
    featuredLink: {
      title: "Free backlink checker",
      description:
        "Check any domain's backlink summary and top 15 backlinks. No signup required.",
      href: "/backlink-checker",
    },
    related: [
      {
        label: "Link Prospecting",
        href: "/docs/skills/link-prospecting",
      },
      { label: "Domain Overview", href: "/features/domain-overview" },
      { label: "SearchCrew MCP", href: "/features/mcp" },
    ],
    faqs: [
      {
        question: "What is backlink analysis used for?",
        answer:
          "Backlink analysis helps you understand which sites link to a domain or page, which links have stronger rank, spam, broken, lost, or nofollow signals, and where competitors are earning authority.",
      },
      {
        question: "Can I check competitor backlinks in SearchCrew?",
        answer:
          "Yes. Enter any domain, yours or a competitor's, and pull its backlinks, referring domains, and top linked pages.",
      },
      {
        question: "How does backlink research connect to SEO planning?",
        answer:
          "Backlinks tell you whether a page ranks on content or on authority. Check them before targeting a keyword to judge whether you can realistically outrank the incumbents, and check a competitor's profile to find sites that might link to you too.",
      },
    ],
  },
  domainOverview: {
    slug: FEATURE_PAGE_SLUGS.domainOverview,
    eyebrow: "Domain Overview",
    navDescription: "Analyze competitor visibility.",
    title: "Domain overview: traffic, keywords, and pages for any domain",
    description:
      "Get a domain overview of any website: estimated organic traffic, ranking keywords, and top organic pages, with one click into backlink and keyword research.",
    primaryKeyword: "domain overview",
    secondaryKeywords: [
      "domain analysis tool",
      "competitor keyword analysis tool",
      "website traffic checker",
    ],
    imageAlt: "SearchCrew domain overview",
    imageSrc: "/screenshots/domain-overview.png",
    imageWidth: 1050,
    imageHeight: 768,
    workflows: [
      {
        title: "Analyze a domain",
        description:
          "Start with a domain and get an overview of estimated organic traffic, organic keyword count, top ranking keywords, and top organic pages.",
      },
      {
        title: "Find competitor keywords",
        description:
          "Inspect keywords a competitor already ranks for and identify topics worth building or defending.",
      },
      {
        title: "Move into deeper research",
        description:
          "Use domain insights to open keyword research, backlink analysis, or rank tracking without starting over.",
      },
    ],
    metrics: [
      { label: "Organic traffic", value: "Visibility" },
      { label: "Organic keywords", value: "Topics" },
      { label: "Top keywords", value: "Rankings" },
      { label: "Top pages", value: "Organic reach" },
    ],
    showMetrics: true,
    useCases: [
      "Research a competitor before writing a content plan.",
      "Estimate a site's organic footprint.",
      "Find keyword gaps between your site and the domains already ranking.",
    ],
    differentiators: [
      "Domain research connects directly to keyword, backlink, and rank tracking workflows.",
      "Built around ranking keywords, estimated traffic, and top pages for practical competitor research.",
      "Full MCP and API access on every plan, so your stack is never gated behind a tier.",
    ],
    related: [
      {
        label: "Competitor Analysis",
        href: "/docs/skills/competitor-analysis",
      },
      { label: "Keyword Research", href: "/features/keyword-research" },
      { label: "Backlinks", href: "/features/backlink-checker" },
    ],
    faqs: [
      {
        question: "What is a domain overview?",
        answer:
          "A domain overview is a snapshot of a website's organic search footprint: estimated organic traffic, how many keywords it ranks for, its top ranking keywords, and its top organic pages. It's usually the first step in competitor research because it shows where a site earns its visibility.",
      },
      {
        question: "How does this compare to Semrush Domain Overview?",
        answer:
          "SearchCrew covers the core of the same report (estimated traffic, organic keywords, top keywords, and top pages) without a triple-digit monthly seat. You can self-host it; proposed hosted tiers begin at $29/month with usage credits included, once billing opens.",
      },
      {
        question: "Can SearchCrew help with competitor keyword analysis?",
        answer:
          "Yes. Enter a competitor's domain and you get the keywords it ranks for and its top organic pages: the raw material for finding topics worth building or defending.",
      },
      {
        question: "Is Domain Overview the same as a traffic checker?",
        answer:
          "Not quite. It includes an estimated-traffic metric, but the value is seeing which keywords and pages produce that traffic, which a plain traffic checker doesn't show.",
      },
    ],
    guides: {
      title: "The Competitive Analysis Strategy Library",
      description:
        "Practitioner strategies for turning a domain overview into a decision. Each guide includes a full walkthrough and a copy-paste MCP prompt.",
      items: [
        {
          label: "Find out who your real competitors are",
          description:
            "Compare a keyword set and read the domains actually in your SERPs.",
          href: "/library/competitive-analysis/find-your-real-competitors",
        },
        {
          label: "Keyword gap analysis: subtract the brand terms first",
          description:
            "Strip brand from both sides and the gap becomes buildable.",
          href: "/library/competitive-analysis/keyword-gap-analysis",
        },
        {
          label: "How accurate are competitor traffic estimates?",
          description:
            "Close-variant stacking, other business lines, and how to correct for both.",
          href: "/library/competitive-analysis/competitor-traffic-estimates",
        },
        {
          label: "Read a competitor's link profile before you copy it",
          description:
            "Referring domains, spam score, and the broken links worth chasing.",
          href: "/library/competitive-analysis/backlink-gap-analysis",
        },
      ],
      cta: {
        label: "Browse all competitive analysis strategies",
        href: "/library/competitive-analysis",
      },
    },
  },
  rankTracking: {
    slug: FEATURE_PAGE_SLUGS.rankTracking,
    eyebrow: "Rank Tracking",
    navDescription: "Monitor keyword positions.",
    title: "Rank tracker for monitoring keyword positions",
    description:
      "Track the keywords that matter, optionally compare desktop and mobile results, and keep ranking changes connected to your research workflow.",
    primaryKeyword: "rank tracker",
    secondaryKeywords: [
      "seo rank tracking tool",
      "keyword rank tracker",
      "google rank tracker",
    ],
    imageAlt: "SearchCrew rank tracking table",
    imageSrc: "/screenshots/rank-tracking.png",
    imageWidth: 1051,
    imageHeight: 768,
    workflows: [
      {
        title: "Add tracked domains",
        description:
          "Create rank tracking configurations for the domains and locations you care about.",
      },
      {
        title: "Track important keywords",
        description:
          "Add keywords manually or from ranking suggestions and monitor positions over time.",
      },
      {
        title: "Compare SERP context",
        description:
          "Review the configured device results, ranking URLs, movement, and available SERP feature signals.",
      },
    ],
    metrics: [
      { label: "Desktop rank", value: "When enabled" },
      { label: "Mobile rank", value: "When enabled" },
      { label: "SERP features", value: "Context" },
      { label: "Position change", value: "Movement" },
    ],
    showMetrics: true,
    useCases: [
      "Monitor target keywords after publishing content.",
      "Track launch, migration, and optimization impact.",
      "Keep ranking checks close to the keywords your team already researched.",
    ],
    differentiators: [
      "Rank tracking is part of the same workspace as discovery, audit, and competitor research.",
      "Optional desktop and mobile tracking helps teams avoid one-dimensional rank reports.",
      "SearchCrew can expose ranking data to AI agents through MCP.",
    ],
    related: [
      { label: "Keyword Clustering", href: "/docs/skills/keyword-clustering" },
      {
        label: "Competitor Analysis",
        href: "/docs/skills/competitor-analysis",
      },
      { label: "Keyword Research", href: "/features/keyword-research" },
    ],
    faqs: [
      {
        question: "What is a rank tracker?",
        answer:
          "A rank tracker monitors where a domain appears for selected keywords over time so you can see whether SEO work is improving visibility.",
      },
      {
        question: "Does SearchCrew track mobile and desktop rankings?",
        answer:
          "Yes: mobile, desktop, or both. Each tracked domain is configured with the devices you want, and enabling both lets you compare them side by side.",
      },
      {
        question: "How should I choose keywords to track?",
        answer:
          "Start with keywords tied to important pages, active content work, and competitor opportunities discovered in keyword research.",
      },
    ],
  },
  savedKeywords: {
    slug: FEATURE_PAGE_SLUGS.savedKeywords,
    eyebrow: "Saved Keywords",
    navDescription: "Organize SEO opportunities.",
    title: "Saved keywords for turning SEO research into a plan",
    description:
      "Keep useful keyword ideas organized so they can inform content planning, rank tracking decisions, and AI-agent workflows.",
    primaryKeyword: "saved keywords",
    secondaryKeywords: [
      "seo keyword list",
      "keyword list tool",
      "keyword planning",
    ],
    imageAlt: "SearchCrew saved keywords list",
    imageSrc: "/screenshots/saved-keywords.png",
    imageWidth: 994,
    imageHeight: 768,
    workflows: [
      {
        title: "Save promising keywords",
        description:
          "Collect useful ideas from keyword research instead of losing them after each search.",
      },
      {
        title: "Organize by topic",
        description:
          "Tag keywords by page, campaign, content cluster, or priority so planning stays readable.",
      },
      {
        title: "Reuse saved keywords across workflows",
        description:
          "Use saved keywords and tags as a planning reference for rank tracking, content planning, or MCP-powered research.",
      },
    ],
    metrics: [
      { label: "Saved ideas", value: "Pipeline" },
      { label: "Tags", value: "Organization" },
      { label: "Volume", value: "Demand" },
      { label: "Difficulty", value: "Priority" },
    ],
    useCases: [
      "Tag keyword ideas into topic or page groups from keyword research.",
      "Prepare candidate keywords to add to rank tracking.",
      "Keep human and AI-agent research in the same workspace.",
    ],
    differentiators: [
      "Saved keywords bridge research, tracking, and AI workflows.",
      "Saved keywords preserve available metrics like volume, CPC, difficulty, intent, and tags.",
      "The workflow stays simple enough for repeated planning sessions.",
    ],
    related: [
      { label: "Keyword Research", href: "/features/keyword-research" },
      { label: "Rank Tracking", href: "/features/rank-tracking" },
      { label: "SearchCrew MCP", href: "/features/mcp" },
    ],
    faqs: [
      {
        question: "Why save keywords in an SEO tool?",
        answer:
          "Saved keywords keep research organized so teams can return to the ideas that are worth writing, optimizing, or tracking.",
      },
      {
        question: "Can saved keywords be used with rank tracking?",
        answer:
          "Yes. Saved keywords are a natural source for deciding which terms should be monitored over time.",
      },
      {
        question: "How do saved keywords fit into SEO planning?",
        answer:
          "Research fills the list, tags group it into pages and campaigns, and the shortlist feeds rank tracking. Saved keywords are the bridge between finding an opportunity and acting on it.",
      },
    ],
  },
  aiBrandVisibility: {
    slug: FEATURE_PAGE_SLUGS.aiBrandVisibility,
    eyebrow: "AI Visibility",
    navDescription: "Look up brand mentions in AI search.",
    title: "Brand lookup for ChatGPT and Google AI Overview visibility",
    description:
      "Look up a brand or domain and review ChatGPT and Google AI Overview mentions, cited pages, and related prompts.",
    primaryKeyword: "ai visibility tool",
    secondaryKeywords: [
      "brand visibility ai search",
      "ai search visibility",
      "answer engine optimization",
    ],
    imageAlt: "SearchCrew AI brand visibility report",
    imageSrc: "/screenshots/ai-brand-visibility.png",
    imageWidth: 1052,
    imageHeight: 768,
    workflows: [
      {
        title: "Look up a brand",
        description:
          "Search for a brand or domain and inspect how ChatGPT and Google AI Overview mention or cite it in available results.",
      },
      {
        title: "Review citations and platforms",
        description:
          "Review the URLs, domains, and platforms contributing to brand mentions.",
      },
      {
        title: "Find visibility gaps",
        description:
          "Use cited pages and related prompts as clues for content, reputation, or comparison coverage to investigate.",
      },
    ],
    metrics: [
      { label: "Mentions", value: "Presence" },
      { label: "Citations", value: "Sources" },
      { label: "Platforms", value: "Surfaces" },
      { label: "Cited domains", value: "Sources" },
    ],
    useCases: [
      "See whether ChatGPT and Google AI Overview data mention or cite your brand or domain.",
      "Find pages and domains cited alongside brand mentions.",
      "Use cited sources and prompts to plan content experiments for answer-engine visibility.",
    ],
    differentiators: [
      "AI visibility sits beside classic SEO research instead of replacing it.",
      "The workflow focuses on concrete sources and mentions, not vague AI hype.",
      "SearchCrew helps teams connect AI mention and citation research to concrete SEO planning.",
    ],
    related: [
      { label: "AI Search Prompts", href: "/features/ai-search-prompts" },
      { label: "Domain Overview", href: "/features/domain-overview" },
      { label: "SearchCrew MCP", href: "/features/mcp" },
    ],
    faqs: [
      {
        question: "What is AI brand visibility?",
        answer:
          "AI brand visibility is how often your brand or domain appears in available ChatGPT and Google AI Overview mention and citation data.",
      },
      {
        question: "How is AI visibility different from traditional SEO?",
        answer:
          "Traditional SEO focuses on rankings and pages. SearchCrew's AI visibility workflow looks at mentions, cited pages, related prompts, and platform-level metrics from supported AI-search sources.",
      },
      {
        question: "Should AI visibility replace keyword research?",
        answer:
          "No. It should sit beside keyword, domain, backlink, and audit data so teams can understand both search rankings and answer coverage.",
      },
    ],
  },
  aiSearchPrompts: {
    slug: FEATURE_PAGE_SLUGS.aiSearchPrompts,
    eyebrow: "Prompt Explorer",
    navDescription: "Compare answers across supported models.",
    title: "AI search prompt explorer for visibility research",
    description:
      "Run the same prompt across supported AI models, compare the answers, and review citations when they are returned.",
    primaryKeyword: "ai search visibility",
    secondaryKeywords: [
      "chatgpt search visibility",
      "ai search prompts",
      "answer engine optimization tool",
    ],
    imageAlt: "SearchCrew prompt explorer",
    imageSrc: "/screenshots/ai-search-prompts.png",
    imageWidth: 1051,
    imageHeight: 768,
    imageCaption:
      "Illustrative interface preview with a sample response. This is not evidence of a current SearchCrew citation.",
    workflows: [
      {
        title: "Test category prompts",
        description:
          "Compare answers to the questions your customers might ask AI tools.",
      },
      {
        title: "Inspect web-backed answers",
        description:
          "When web search is enabled, inspect the pages and domains cited by model responses.",
      },
      {
        title: "Check brand mentions",
        description:
          "Highlight a brand and see whether each model mentions it in the answer or cited sources.",
      },
    ],
    metrics: [
      { label: "Prompts", value: "Questions" },
      { label: "Web context", value: "Sources" },
      { label: "Web search country", value: "Regional context" },
      { label: "Brand mentions", value: "Presence" },
    ],
    useCases: [
      "Compare how supported AI models answer the same prompt.",
      "Review which pages and domains appear in cited sources.",
      "Check whether a brand appears in AI answers and citations.",
    ],
    differentiators: [
      "Prompt research lives in the same workspace as domain, keyword, and brand visibility workflows.",
      "SearchCrew treats AI search as a research layer, not a replacement for SEO fundamentals.",
      "SearchCrew MCP exposes keyword, SERP, domain, backlink, saved keyword, and rank-tracking tools to AI agents.",
    ],
    related: [
      { label: "AI Brand Visibility", href: "/features/ai-brand-visibility" },
      { label: "Keyword Research", href: "/features/keyword-research" },
      { label: "SearchCrew MCP", href: "/features/mcp" },
    ],
    faqs: [
      {
        question: "What is an AI search prompt explorer?",
        answer:
          "It lets teams run the same prompt across supported AI models, compare answers, and inspect citation URLs returned with supported model responses.",
      },
      {
        question: "Why does prompt research matter for SEO?",
        answer:
          "Prompts are the new queries: they show the comparison, problem, and buying questions your customers now ask AI tools. The cited sources show which pages and domains those answers are built on, so you can see where your coverage is missing.",
      },
      {
        question: "Can this help with answer engine optimization?",
        answer:
          "Yes. Prompt Explorer is a starting point for mapping prompt responses and returned citations back to source pages and possible SEO follow-up work.",
      },
    ],
  },
  aiCrawlerAccess: {
    slug: FEATURE_PAGE_SLUGS.aiCrawlerAccess,
    eyebrow: "AI crawler access",
    navDescription: "See which named AI search crawlers robots.txt allows.",
    title: "AI crawler access: which bots can read your site",
    description:
      "Check named AI search crawlers against robots.txt. Uses no credits. Training-bot blocks are a preference, not a ranking defect. Hosted billing is paused; this check is not a $10 SKU.",
    primaryKeyword: "ai crawler access",
    secondaryKeywords: [
      "robots.txt ai crawlers",
      "chatgpt search robots.txt",
      "geo crawler access",
    ],
    imageAlt: "SearchCrew",
    imageSrc: "/social-card.jpg",
    imageWidth: 1200,
    imageHeight: 630,
    imageCaption: "SearchCrew brand illustration.",
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
    ],
    metrics: [
      { label: "Search crawlers", value: "Access map" },
      { label: "Training crawlers", value: "Preference" },
      { label: "Credits", value: "None" },
      { label: "SKU", value: "None" },
    ],
    showMetrics: true,
    useCases: [
      "See whether ChatGPT Search, Claude, Perplexity, or Googlebot is blocked before you rewrite pages for AI answers.",
      "Confirm a training-bot block is intentional instead of treating it as a defect.",
    ],
    differentiators: [
      "No credits for this check. Pay is paused and there is no hosted $10 SKU.",
      "This report is an access map, not a ranking or citation prediction.",
    ],
    related: [
      { label: "AI Brand Visibility", href: "/features/ai-brand-visibility" },
      { label: "SearchCrew MCP", href: "/features/mcp" },
      { label: "AI Crawler Access skill", href: "/docs/skills/geo-crawlers" },
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
    ],
  },
} satisfies Record<string, FeaturePage>;

export const featureGroups = [
  {
    label: "Keyword workflows",
    description: "Find, organize, and monitor the keywords that matter.",
    pages: [
      featurePages.keywordResearch,
      featurePages.savedKeywords,
      featurePages.rankTracking,
    ],
  },
  {
    label: "Domain research",
    description: "Understand competitors, backlinks, and technical health.",
    pages: [
      featurePages.domainOverview,
      featurePages.backlinks,
      featurePages.siteAudit,
    ],
  },
  {
    label: "AI visibility",
    description: "Research AI search prompts, citations, and brand visibility.",
    pages: [
      featurePages.aiBrandVisibility,
      featurePages.aiSearchPrompts,
      featurePages.aiCrawlerAccess,
    ],
  },
] as const;
