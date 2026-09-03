/**
 * Format check for the proposed /llms.txt content map.
 *
 * This is not a robots directive and not a ranking or citation prediction.
 * Absence is not a defect.
 */

export type LlmsTxtFetchStatus = "found" | "missing" | "error";

export type LlmsTxtCheckStatus = "pass" | "fail";

export type LlmsTxtCheck = {
  id: string;
  label: string;
  status: LlmsTxtCheckStatus;
  detail: string;
};

type LlmsTxtEntry = {
  title: string;
  url: string;
  description: string;
  absolute: boolean;
};

type LlmsTxtSection = {
  heading: string;
  entries: LlmsTxtEntry[];
};

export type LlmsTxtParse = {
  title: string | null;
  description: string | null;
  sections: LlmsTxtSection[];
  checks: LlmsTxtCheck[];
};

export type LlmsTxtReport = LlmsTxtParse & {
  origin: string;
  url: string;
  fetchStatus: LlmsTxtFetchStatus;
  httpStatus: number | null;
};

const ENTRY_RE = /^- \[([^\]]+)\]\(([^)]+)\)(?:\s*:\s*(.*))?$/;

function isAbsoluteHttpUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export function parseLlmsTxt(markdown: string): LlmsTxtParse {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let title: string | null = null;
  let description: string | null = null;
  const sections: LlmsTxtSection[] = [];
  let current: LlmsTxtSection | null = null;
  let awaitingDescription = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (!title) {
      const heading = /^#\s+(.+)$/.exec(line);
      if (heading) {
        title = heading[1].trim();
        awaitingDescription = true;
      }
      continue;
    }

    if (awaitingDescription) {
      awaitingDescription = false;
      if (line.startsWith(">")) {
        description = line.replace(/^>\s?/, "").trim() || null;
        continue;
      }
    }

    const section = /^##\s+(.+)$/.exec(line);
    if (section) {
      current = { heading: section[1].trim(), entries: [] };
      sections.push(current);
      continue;
    }

    const entry = ENTRY_RE.exec(line);
    if (entry && current) {
      const url = entry[2].trim();
      current.entries.push({
        title: entry[1].trim(),
        url,
        description: (entry[3] ?? "").trim(),
        absolute: isAbsoluteHttpUrl(url),
      });
    }
  }

  const entries = sections.flatMap((section) => section.entries);
  const relative = entries.filter((entry) => !entry.absolute);
  const checks: LlmsTxtCheck[] = [
    {
      id: "title",
      label: "H1 title",
      status: title ? "pass" : "fail",
      detail: title ? title : "First heading should be `# Site name`.",
    },
    {
      id: "description",
      label: "Blockquote description",
      status: description ? "pass" : "fail",
      detail: description
        ? description
        : "Put a one-line `>` summary after the title.",
    },
    {
      id: "sections",
      label: "H2 sections",
      status: sections.length > 0 ? "pass" : "fail",
      detail:
        sections.length > 0
          ? `${sections.length} section${sections.length === 1 ? "" : "s"}`
          : "Add at least one `##` section.",
    },
    {
      id: "entries",
      label: "Page entries",
      status: entries.length > 0 ? "pass" : "fail",
      detail:
        entries.length > 0
          ? `${entries.length} page${entries.length === 1 ? "" : "s"}`
          : "List pages as `- [Title](https://example.com/page): summary`.",
    },
    {
      id: "urls",
      label: "Absolute URLs",
      status: entries.length > 0 && relative.length === 0 ? "pass" : "fail",
      detail:
        entries.length === 0
          ? "No page URLs to check."
          : relative.length === 0
            ? "All listed URLs are absolute."
            : `${relative.length} relative URL${relative.length === 1 ? "" : "s"}. Use full https:// links.`,
    },
  ];

  return { title, description, sections, checks };
}
