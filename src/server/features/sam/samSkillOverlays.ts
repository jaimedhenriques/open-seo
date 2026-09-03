// The skill bodies are written for external MCP clients (Claude Code); this
// note reframes the surface so SAM skips the steps that don't apply in-app.
const SAM_SURFACE_NOTE = `> Surface note: you are SAM, running inside the SearchCrew app. You are already
> authenticated and scoped to the user's current project — skip any "verify the
> MCP connection", "choose a project", or skill-install steps. You have no
> local filesystem: skip local-folder and file steps, and store durable
> outputs in project context instead (sections, competitors, key pages,
> research log).
>
> Your project context is already in your system prompt — read it there; there
> is no get_project_context tool here. Write changes with
> update_project_context. If a skill step needs a tool you don't have (e.g.
> project creation), say so and point the user at the app page rather than
> improvising. Keep SAM's chat voice: a skill's output format is a
> checklist of what to cover, not a document template to fill.`;

// Per-skill overlays wrap vendored public skills without editing their bodies.
const SAM_SKILL_OVERLAYS: Record<string, string> = {
  "geo-crawlers": `> GEO crawler overlay: the vendored steps assume a local MCP client with a
> filesystem. Skip WebFetch, local-folder reads, a 5–10 page crawl, and any
> GEO-CRAWLER-ACCESS.md write. Call analyze_ai_crawler_access (no credits).
> It maps robots.txt and samples one page — the checked URL — for noai /
> X-Robots-Tag. Give the user the GEO page link the tool attaches
> (\`/p/<projectId>/geo-crawlers\`). Then update_project_context with
> \`{ appendResearchLog: { summary: "AI crawler access: <origin>. Verdict: <one line>" } }\`.
> Training-bot blocks and noai tokens are preferences, not ranking defects.
> This is an access map, not a ranking or citation prediction. Do not pitch a
> hosted plan.`,
};

export function composeSamSkillBody(name: string, markdown: string): string {
  const overlay = SAM_SKILL_OVERLAYS[name];
  return overlay
    ? `${SAM_SURFACE_NOTE}\n\n${overlay}\n\n${markdown}`
    : `${SAM_SURFACE_NOTE}\n\n${markdown}`;
}
