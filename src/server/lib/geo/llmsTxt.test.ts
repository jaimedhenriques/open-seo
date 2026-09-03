import { describe, expect, it } from "vitest";
import { parseLlmsTxt } from "./llmsTxt";

describe("parseLlmsTxt", () => {
  it("reads title, description, sections, and absolute entries", () => {
    const parsed = parseLlmsTxt(`# Example

> Widgets for shops.

## Docs

- [Home](https://example.com/): Landing page
- [Pricing](https://example.com/pricing): Plans
`);
    expect(parsed.title).toBe("Example");
    expect(parsed.description).toBe("Widgets for shops.");
    expect(parsed.sections).toHaveLength(1);
    expect(parsed.sections[0]?.entries).toHaveLength(2);
    expect(parsed.checks.every((check) => check.status === "pass")).toBe(true);
    expect(JSON.stringify(parsed).toLowerCase()).not.toMatch(
      /fitch|jaime|win-rate|autumn|\$10/,
    );
  });

  it("fails relative URLs without treating a missing file as this case", () => {
    const parsed = parseLlmsTxt(`# Example

> Widgets for shops.

## Docs

- [Home](/): Landing page
`);
    const urls = parsed.checks.find((check) => check.id === "urls");
    expect(urls?.status).toBe("fail");
    expect(urls?.detail).toContain("relative");
  });

  it("fails an empty body on required format checks", () => {
    const parsed = parseLlmsTxt("");
    expect(parsed.title).toBeNull();
    expect(
      parsed.checks.filter((check) => check.status === "fail"),
    ).toHaveLength(5);
  });
});
