/**
 * JSON-LD presence sample from HTML source.
 *
 * This is a presence report for the checked URL only. Missing JSON-LD is
 * optional. It is not a ranking or citation lever.
 */

const SCRIPT_RE =
  /<script\b[^>]*\btype\s*=\s*["']application\/ld\+json[^"']*["'][^>]*>([\s\S]*?)<\/script>/gi;
const MAX_TYPES = 20;

type JsonLdSample = {
  status: "found" | "missing" | "invalid";
  blockCount: number;
  types: string[];
};

function normalizeJsonLdText(raw: string): string {
  return raw
    .replace(/^\s*<!(?:--|\[CDATA\[)/, "")
    .replace(/(?:-->|\]\]>)\s*$/, "")
    .trim();
}

function isJsonRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function collectTypes(value: unknown, into: Set<string>): void {
  if (Array.isArray(value)) {
    for (const item of value) collectTypes(item, into);
    return;
  }
  if (!isJsonRecord(value)) return;
  const typeValue = value["@type"];
  if (typeof typeValue === "string" && typeValue.trim()) {
    into.add(typeValue.trim());
  } else if (Array.isArray(typeValue)) {
    for (const item of typeValue) {
      if (typeof item === "string" && item.trim()) into.add(item.trim());
    }
  }
  if (Array.isArray(value["@graph"])) collectTypes(value["@graph"], into);
  for (const nested of Object.values(value)) {
    if (nested && typeof nested === "object") collectTypes(nested, into);
  }
}

export function parseJsonLdSample(
  html: string | null | undefined,
): JsonLdSample {
  if (!html) {
    return { status: "missing", blockCount: 0, types: [] };
  }

  const types = new Set<string>();
  let blockCount = 0;
  let parsedOk = 0;
  SCRIPT_RE.lastIndex = 0;
  for (const match of html.matchAll(SCRIPT_RE)) {
    blockCount += 1;
    const body = normalizeJsonLdText(match[1] ?? "");
    if (!body) continue;
    try {
      collectTypes(JSON.parse(body), types);
      parsedOk += 1;
    } catch {
      // Invalid JSON in this block. Other blocks can still count.
    }
  }

  if (blockCount === 0) {
    return { status: "missing", blockCount: 0, types: [] };
  }
  if (parsedOk === 0) {
    return { status: "invalid", blockCount, types: [] };
  }
  return {
    status: "found",
    blockCount,
    types: [...types].toSorted().slice(0, MAX_TYPES),
  };
}
