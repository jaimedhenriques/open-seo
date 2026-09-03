/**
 * AI crawler access map from robots.txt.
 *
 * Public bot tokens only. This is an access report, not a ranking or
 * citation prediction, and it does not treat training-bot blocks as defects.
 */

type CrawlerTier = "search" | "ecosystem" | "training";
type AccessRule = "specific" | "wildcard" | "default";
type AccessStatus = "allowed" | "blocked";

type CrawlerCatalogEntry = {
  userAgent: string;
  operator: string;
  tier: CrawlerTier;
};

type CrawlerAccessRow = CrawlerCatalogEntry & {
  status: AccessStatus;
  rule: AccessRule;
};

export type RobotsTxtFetchStatus = "found" | "missing" | "error";
export type LlmsTxtFetchStatus = "found" | "missing" | "error";
export type PageSampleFetchStatus = "found" | "missing" | "error";

export type PageRobotSample = {
  url: string;
  status: PageSampleFetchStatus;
  httpStatus: number | null;
  robotsMeta: string | null;
  xRobotsTag: string | null;
  tokens: string[];
};

export type AiCrawlerAccessReport = {
  origin: string;
  robotsTxt: {
    url: string;
    status: RobotsTxtFetchStatus;
    httpStatus: number | null;
  };
  llmsTxt: {
    url: string;
    status: LlmsTxtFetchStatus;
    httpStatus: number | null;
  };
  pageSample: PageRobotSample;
  crawlers: CrawlerAccessRow[];
  sitemapUrls: string[];
  contentSignals: Record<string, string> | null;
};

const PAGE_ROBOT_TOKENS = [
  "noai",
  "noimageai",
  "nosnippet",
  "noindex",
  "nofollow",
  "none",
  "noarchive",
] as const;

export function extractRobotsMeta(html: string): string | null {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const contents: string[] = [];
  for (const tag of tags) {
    const name = /(?:name|http-equiv)\s*=\s*["']?(robots|googlebot)["']?/i.exec(
      tag,
    );
    if (!name) continue;
    const quoted = /content\s*=\s*["']([^"']*)["']/i.exec(tag);
    const bare = /content\s*=\s*([^\s>]+)/i.exec(tag);
    const value = quoted?.[1] ?? bare?.[1];
    if (value) contents.push(value);
  }
  return contents.length > 0 ? contents.join(", ") : null;
}

export function parsePageRobotTokens(
  ...parts: Array<string | null | undefined>
): string[] {
  const found = new Set<string>();
  for (const part of parts) {
    if (!part) continue;
    for (const raw of part.split(/[,;]/)) {
      const token = raw.trim().split(":")[0]?.trim().toLowerCase();
      if (token && (PAGE_ROBOT_TOKENS as readonly string[]).includes(token)) {
        found.add(token);
      }
    }
  }
  return [...found].toSorted();
}

type RobotsGroup = {
  agents: string[];
  allows: string[];
  disallows: string[];
};

const AI_CRAWLER_CATALOG: readonly CrawlerCatalogEntry[] = [
  { userAgent: "OAI-SearchBot", operator: "OpenAI", tier: "search" },
  { userAgent: "ChatGPT-User", operator: "OpenAI", tier: "search" },
  { userAgent: "Claude-SearchBot", operator: "Anthropic", tier: "search" },
  { userAgent: "Claude-User", operator: "Anthropic", tier: "search" },
  { userAgent: "PerplexityBot", operator: "Perplexity", tier: "search" },
  { userAgent: "Googlebot", operator: "Google", tier: "search" },
  { userAgent: "GoogleOther", operator: "Google", tier: "ecosystem" },
  { userAgent: "Applebot-Extended", operator: "Apple", tier: "ecosystem" },
  { userAgent: "Amazonbot", operator: "Amazon", tier: "ecosystem" },
  { userAgent: "FacebookBot", operator: "Meta", tier: "ecosystem" },
  { userAgent: "GPTBot", operator: "OpenAI", tier: "training" },
  { userAgent: "ClaudeBot", operator: "Anthropic", tier: "training" },
  { userAgent: "Google-Extended", operator: "Google", tier: "training" },
  { userAgent: "CCBot", operator: "Common Crawl", tier: "training" },
  { userAgent: "Bytespider", operator: "ByteDance", tier: "training" },
  { userAgent: "cohere-ai", operator: "Cohere", tier: "training" },
];

const ROOT_PATH = "/";

function parseContentSignals(value: string): Record<string, string> {
  const signals: Record<string, string> = {};
  for (const part of value.split(",")) {
    const [rawKey, rawVal] = part.split("=").map((item) => item.trim());
    if (rawKey && rawVal) signals[rawKey.toLowerCase()] = rawVal.toLowerCase();
  }
  return signals;
}

export function parseRobotsGroups(text: string): {
  groups: RobotsGroup[];
  sitemapUrls: string[];
  contentSignals: Record<string, string> | null;
} {
  const groups: RobotsGroup[] = [];
  const sitemapUrls: string[] = [];
  let contentSignals: Record<string, string> | null = null;
  let current: RobotsGroup | null = null;

  const flush = () => {
    if (current && current.agents.length > 0) groups.push(current);
    current = null;
  };

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) {
      flush();
      continue;
    }
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const field = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();

    if (field === "sitemap") {
      if (value) sitemapUrls.push(value);
      continue;
    }
    if (field === "content-signal") {
      contentSignals = parseContentSignals(value);
      continue;
    }
    if (field === "user-agent") {
      const agent = value.toLowerCase();
      if (!agent) continue;
      if (!current || current.allows.length + current.disallows.length > 0) {
        flush();
        current = { agents: [agent], allows: [], disallows: [] };
      } else {
        current.agents.push(agent);
      }
      continue;
    }
    if (!current) continue;
    if (field === "allow") current.allows.push(value);
    if (field === "disallow") current.disallows.push(value);
  }
  flush();

  return { groups, sitemapUrls, contentSignals };
}

function pathMatchesRule(rule: string, path: string): boolean {
  if (rule === "") return true;
  if (rule.endsWith("$")) return path === rule.slice(0, -1);
  return path.startsWith(rule);
}

function longestMatchingLength(rules: string[], path: string): number {
  let best = -1;
  for (const rule of rules) {
    if (!pathMatchesRule(rule, path)) continue;
    if (rule.length > best) best = rule.length;
  }
  return best;
}

function groupAllowsPath(group: RobotsGroup, path: string): boolean {
  const allowLen = longestMatchingLength(group.allows, path);
  const disallowLen = longestMatchingLength(
    group.disallows.filter((rule) => rule !== ""),
    path,
  );
  if (allowLen < 0 && disallowLen < 0) return true;
  return allowLen >= disallowLen;
}

function resolveGroup(
  groups: RobotsGroup[],
  userAgent: string,
): { group: RobotsGroup | null; rule: AccessRule } {
  const token = userAgent.toLowerCase();
  const specific = groups.find((group) => group.agents.includes(token));
  if (specific) return { group: specific, rule: "specific" };
  const wildcard = groups.find((group) => group.agents.includes("*"));
  if (wildcard) return { group: wildcard, rule: "wildcard" };
  return { group: null, rule: "default" };
}

export function evaluateAiCrawlerAccess(
  robotsTxt: string | null,
): Pick<AiCrawlerAccessReport, "crawlers" | "sitemapUrls" | "contentSignals"> {
  if (robotsTxt == null) {
    return {
      crawlers: AI_CRAWLER_CATALOG.map((entry) => ({
        ...entry,
        status: "allowed",
        rule: "default",
      })),
      sitemapUrls: [],
      contentSignals: null,
    };
  }

  const { groups, sitemapUrls, contentSignals } = parseRobotsGroups(robotsTxt);
  return {
    crawlers: AI_CRAWLER_CATALOG.map((entry) => {
      const { group, rule } = resolveGroup(groups, entry.userAgent);
      const status: AccessStatus =
        group == null || groupAllowsPath(group, ROOT_PATH)
          ? "allowed"
          : "blocked";
      return { ...entry, status, rule };
    }),
    sitemapUrls,
    contentSignals,
  };
}
