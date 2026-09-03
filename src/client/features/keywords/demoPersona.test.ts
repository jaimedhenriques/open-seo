import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  DEMO_KEYWORD_ROWS,
  DEMO_PERSONA,
  DEMO_WORKSPACE_COPY,
  KEYWORD_WORKSPACE_COPY,
  demoIntentLabel,
  formatDemoCpc,
  formatDemoVolume,
  isDemoPersonaId,
  keywordWorkspaceCopyText,
  keywordWorkspaceCopyViolations,
} from "./demoPersona";

describe("keyword research demo workspace", () => {
  const text = keywordWorkspaceCopyText();

  it("keeps the product heading, not a marketing title", () => {
    expect(KEYWORD_WORKSPACE_COPY.title).toBe("Keyword Research");
    expect(text.toLowerCase()).not.toContain("ranking opportunities");
  });

  it("is a named demo persona with no credits", () => {
    expect(isDemoPersonaId(DEMO_PERSONA.id)).toBe(true);
    expect(DEMO_PERSONA.brand).toBe("Lumen Bikes");
    expect(DEMO_WORKSPACE_COPY.badge).toBe("Demo");
    expect(text.toLowerCase()).toContain("no credits");
    expect(text.toLowerCase()).toContain("paused");
    expect(DEMO_WORKSPACE_COPY.caption).toContain("$10 SKU");
  });

  it("ships a sample keyword list for the demo shop", () => {
    expect(DEMO_KEYWORD_ROWS.length).toBeGreaterThanOrEqual(6);
    expect(DEMO_KEYWORD_ROWS.map((row) => row.keyword)).toContain(
      DEMO_PERSONA.seed,
    );
    expect(formatDemoVolume(33100)).toBe("33,100");
    expect(formatDemoCpc(1.42)).toBe("1.42");
    expect(demoIntentLabel("commercial")).toBe("Commercial");
  });

  it("does not claim a win-rate, #1 rank, or open source SearchCrew", () => {
    expect(keywordWorkspaceCopyViolations(text)).toEqual([]);
    expect(text.toLowerCase()).not.toContain("open source");
    expect(text.toLowerCase()).not.toContain("mit license");
  });
});

describe("LICENSE notices", () => {
  it("keeps the OpenSEO MIT upstream notice", () => {
    const license = readFileSync(resolve(process.cwd(), "LICENSE"), "utf8");
    expect(license).toContain("Copyright (c) 2026 Ben Senescu");
    expect(license).toContain("MIT License");
    expect(license).toContain("SearchCrew is a derivative work of OpenSEO");
    expect(license).toContain("This repository is not open source");
  });

  it("keeps the vendored UI kit MIT notice", () => {
    const license = readFileSync(
      resolve(process.cwd(), "src/client/ui/LICENSE.md"),
      "utf8",
    );
    expect(license).toContain("MIT License");
    expect(license).toContain("Copyright (c) 2023 shadcn");
  });
});
