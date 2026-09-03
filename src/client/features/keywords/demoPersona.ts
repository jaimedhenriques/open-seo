import type { KeywordIntent, KeywordResearchRow } from "@/types/keywords";

export const KEYWORD_WORKSPACE_COPY = {
  title: "Keyword Research",
  subtitle:
    "Volume, difficulty, and intent for this project. Demo data uses no credits. Hosted billing is paused.",
} as const;

export const DEMO_PERSONA = {
  id: "lumen-bikes",
  brand: "Lumen Bikes",
  kind: "Independent bike shop",
  market: "United States",
  seed: "gravel bike",
  locationCode: 2840,
} as const;

export const DEMO_WORKSPACE_COPY = {
  title: `${DEMO_PERSONA.brand} demo`,
  description:
    "Sample demand for a shop homepage. Demo data only. Uses no credits.",
  caption:
    "Hosted billing is paused. This list is not a $10 SKU and is not a ranking prediction.",
  creditsHint: "Uses no credits",
  badge: "Demo",
} as const;

type DemoRow = Pick<
  KeywordResearchRow,
  "keyword" | "searchVolume" | "cpc" | "keywordDifficulty" | "intent"
>;

export const DEMO_KEYWORD_ROWS: readonly DemoRow[] = [
  {
    keyword: "gravel bike",
    searchVolume: 33100,
    cpc: 1.42,
    keywordDifficulty: 38,
    intent: "commercial",
  },
  {
    keyword: "bike shop near me",
    searchVolume: 49500,
    cpc: 2.18,
    keywordDifficulty: 24,
    intent: "transactional",
  },
  {
    keyword: "electric cargo bike",
    searchVolume: 12100,
    cpc: 1.87,
    keywordDifficulty: 41,
    intent: "commercial",
  },
  {
    keyword: "how to true a wheel",
    searchVolume: 5400,
    cpc: 0.42,
    keywordDifficulty: 19,
    intent: "informational",
  },
  {
    keyword: "city bike commuter",
    searchVolume: 8100,
    cpc: 1.15,
    keywordDifficulty: 33,
    intent: "commercial",
  },
  {
    keyword: "llms.txt local shop",
    searchVolume: 320,
    cpc: 0.0,
    keywordDifficulty: 12,
    intent: "informational",
  },
  {
    keyword: "ai overview bike shop",
    searchVolume: 720,
    cpc: 0.61,
    keywordDifficulty: 28,
    intent: "informational",
  },
  {
    keyword: "kids balance bike",
    searchVolume: 14800,
    cpc: 0.94,
    keywordDifficulty: 22,
    intent: "transactional",
  },
] as const;

const BANNED = [
  "win-rate",
  "win rate",
  "winrate",
  "#1",
  "number one",
  "open source",
  "opensource",
  "ranking opportunities",
  "fitch",
] as const;

export function keywordWorkspaceCopyText(): string {
  return [
    KEYWORD_WORKSPACE_COPY.title,
    KEYWORD_WORKSPACE_COPY.subtitle,
    DEMO_PERSONA.brand,
    DEMO_PERSONA.kind,
    DEMO_PERSONA.market,
    DEMO_PERSONA.seed,
    DEMO_WORKSPACE_COPY.title,
    DEMO_WORKSPACE_COPY.description,
    DEMO_WORKSPACE_COPY.caption,
    DEMO_WORKSPACE_COPY.creditsHint,
    DEMO_WORKSPACE_COPY.badge,
    ...DEMO_KEYWORD_ROWS.map((row) => row.keyword),
  ].join("\n");
}

export function keywordWorkspaceCopyViolations(text: string): string[] {
  const haystack = text.toLowerCase();
  return BANNED.filter((term) => haystack.includes(term));
}

export function formatDemoVolume(value: number | null): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDemoCpc(value: number | null): string {
  if (value == null) return "—";
  return value.toFixed(2);
}

export function demoIntentLabel(intent: KeywordIntent): string {
  if (intent === "unknown") return "Unclassified";
  return intent.charAt(0).toUpperCase() + intent.slice(1);
}

export function isDemoPersonaId(id: string): boolean {
  return id === DEMO_PERSONA.id;
}
