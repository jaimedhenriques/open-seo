# SearchCrew SEO/GEO plan

Status: active  
Owner: Helix / SearchCrew  
Date: 2026-09-03  
Repo: [`jaimedhenriques/searchcrew`](https://github.com/jaimedhenriques/searchcrew)  
Product: [searchcrew.ai](https://searchcrew.ai)

## Goal

SearchCrew is the top GTM product for SEO and GEO. Squadbots is the agent layer that runs SearchCrew skills and MCP tools. One shared product surface; no parallel SEO brand.

This plan does not use Jaime's employer, career identity, or Fitch connection.

## Constraints

- UI lock: copy components from [`jaimedhenriques/ui`](https://github.com/jaimedhenriques/ui) (MIT, keep `LICENSE.md`) first. Use shadcn only when that kit has no equivalent.
- Keep the repo `LICENSE` file, including the OpenSEO MIT upstream notice.
- Pay is paused. No $10 hosted SKU, no new Autumn product, no credit gate on GEO crawler access.
- LICENSE-safe: original SearchCrew code plus MIT-attributed UI kit copies. Do not edit vendored `geo-*` skill bodies.
- One increment per delivery. Tests required. UX bar is 10/10 for the shipped surface in the Ahrefs/Semrush SEO+GEO category. Do not claim a win-rate.

## Current state

- MCP + SAM tool `analyze_ai_crawler_access` maps named AI crawlers from `robots.txt` with no DataForSEO credits (PR 13).
- App chrome is daisyUI. The UI kit is shadcn-style New York v4. GEO UI maps kit tokens onto the SearchCrew theme.
- Hosted MCP is still prelaunch. Self-hosted and in-app SAM can use the tool today.

## Increment 1 (shipped)

GEO crawler access page at `/p/$projectId/geo-crawlers`.

- Default URL is the project domain. User can check any public URL.
- Uses no credits. Training-bot blocks are labeled as preference, not defects.
- Built from vendored kit components: Button, Badge, Card, Table, Input.

## Increment 2 (shipped)

Public GTM page at `/features/ai-crawler-access` on searchcrew.ai.

- Explains the credit-free robots.txt crawler map. No $10 SKU.
- Copy tests lock no-credits, search vs training, allow-all for missing robots.txt.

## Increment 3 (this delivery)

Page-level `noai` / `X-Robots-Tag` sample on the same GEO report.

- Samples the checked URL only. Not a sitewide crawl.
- Uses no credits. Training-bot and noai tokens are preferences, not ranking defects.
- Shown on the in-app GEO page with vendored kit cards.

## Later increments (not this delivery)

4. Squadbots skill step that opens the in-app page and writes a research-log line.
5. Broader chrome migration to the UI kit, one surface at a time.

## Stop conditions

- Do not add a paid plan gate to this page.
- Do not copy proprietary GEO products.
- Do not mention Fitch or Jaime's employer.
- Do not replace daisyUI app-wide in this increment.
- Do not send email, social posts, or outreach.
