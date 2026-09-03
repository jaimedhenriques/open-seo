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

## Increment 3 (shipped)

Page-level `noai` / `X-Robots-Tag` sample on the same GEO report.

- Samples the checked URL only. Not a sitewide crawl.
- Uses no credits. Training-bot and noai tokens are preferences, not ranking defects.
- Shown on the in-app GEO page with vendored kit cards.

## Increment 4 (open PR 16)

SAM overlay for `geo-crawlers`.

## Increment 5 (PR 17)

In-app `llms.txt` checker at `/p/$projectId/llms-txt`.

- Fetches `/llms.txt` only. Format checks for title, description, sections, entries, absolute URLs.
- Uses no credits. Missing file is optional, not a ranking defect.
- Built from vendored kit components: Button, Badge, Card, Table, Input.
- MCP `analyze_llms_txt` attaches the same page.

## Increment 6 (PR 19)

Public GTM page at `/features/llms-txt` on searchcrew.ai.

- Explains the credit-free /llms.txt format check. No $10 SKU.
- Copy tests lock no-credits, optional file, no ranking lever.

## Increment 7 (PR 20)

SAM overlay for `geo-llmstxt`: call `analyze_llms_txt`, open the in-app page, write a research-log line.

- Wrap the vendored skill in `samSkills.ts`. Do not edit `geo-*` SKILL.md bodies.
- Missing file stays optional. No credits. No filesystem write.

## Increment 8 (PR 21)

GEO status alerts from the UI kit on the crawler and llms.txt pages.

- Vendored `Alert` from `jaimedhenriques/ui` pin `63c1308d`. No cva, no radix.
- Fetch errors use destructive. Empty domain uses default. No `$10` SKU.

## Increment 9 (PR 22)

In-app sibling links between `/p/$projectId/geo-crawlers` and `/p/$projectId/llms-txt`.

- Kit `Button` outline. Copy says uses no credits. No `$10` SKU.
- Does not replace daisyUI app-wide.

## Increment 10 (PR 23)

JSON-LD presence sample on the checked URL of the crawler report.

- Reads `application/ld+json` from the already-fetched page HTML. Uses no credits.
- Missing JSON-LD is optional. Not a ranking or citation lever.
- Kit Card and Badge. Do not edit vendored `geo-schema` SKILL.md.

## Increment 11 (PR 24)

Public GTM copy on `/features/ai-crawler-access` for the JSON-LD sample.

- Same credit-free check. Missing JSON-LD is optional. Not a ranking or citation lever.
- No `$10` SKU. Do not replace daisyUI app-wide.

## Increment 12 (PR 25)

Public sibling links between `/features/ai-crawler-access` and `/features/llms-txt`.

- Featured and related links. Copy says uses no credits. No `$10` SKU.
- Does not replace daisyUI app-wide.

## Increment 13 (PR 26)

Project sidebar GEO group for `/p/$projectId/geo-crawlers` and `/p/$projectId/llms-txt`.

- First-class GEO nav, not buried in Research. No `$10` SKU.
- Does not replace daisyUI app-wide.

## Increment 14 (PR 27)

Dashboard GEO card linking `/p/$projectId/geo-crawlers` and `/p/$projectId/llms-txt`.

- Kit `Card` and outline `Button` from `jaimedhenriques/ui`. Keep `src/client/ui/LICENSE.md`.
- `hasData: true` so the card sorts with data cards. Copy says uses no credits. Not a ranking or citation lever. No `$10` SKU.
- Does not replace daisyUI app-wide.

## Increment 15 (PR 28)

Homepage product grid cards for `/features/ai-crawler-access` and `/features/llms-txt`.

- Credit-free blurbs. Optional llms.txt. No ranking or citation claim. No `$10` SKU.
- Does not replace daisyUI app-wide.

## Increment 16 (PR 29)

GEO MCP tools on `/ai` in a kit `Card` with outline `Badge`.

- `analyze_ai_crawler_access` and `analyze_llms_txt`. Copy says uses no credits. Optional llms.txt. Not a ranking or citation lever. No `$10` SKU.
- Keep `src/client/ui/LICENSE.md`. Do not replace daisyUI app-wide.

## Increment 17 (PR 30)

Kit outline `Badge` "No credits" on the project sidebar GEO group label.

- Only the GEO group. Other nav groups stay daisyUI. Do not convert `AvailableTools`.
- Keep `src/client/ui/LICENSE.md`. No `$10` SKU.

## Increment 18 (PR 31)

Kit outline `Badge` "No credits" on the dashboard GEO card.

- Reuse `GEO_NAV_BADGE`. One surface only. Do not convert `AvailableTools` or the rest of the sidebar.
- Keep `src/client/ui/LICENSE.md`. No `$10` SKU.

## Increment 19 (PR 32)

Kit outline `Button` on GEO check pages to `/ai` MCP tools.

- Same credit-free crawler and llms.txt checks. One surface: `GeoSiblingNav`.
- Keep `src/client/ui/LICENSE.md`. No `$10` SKU.

## Increment 20 (PR 33)

Kit outline `Badge` "Optional" on the llms.txt page header.

- Missing `/llms.txt` stays optional, not a ranking or citation lever. One surface only.
- Do not convert the crawler page or `AvailableTools`. Keep `src/client/ui/LICENSE.md`. No `$10` SKU.

## Increment 21 (PR 34)

Kit outline `Badge` "Access map" on the AI crawler access page header.

- This report is an access map, not a ranking or citation lever. One surface only.
- Do not convert the llms.txt page or `AvailableTools`. Keep `src/client/ui/LICENSE.md`. No `$10` SKU.

## Increment 22 (PR 35)

Visible kit `Alert` for the MCP hint on GEO check pages.

- `GeoSiblingNav` shows `analyze_ai_crawler_access` / `analyze_llms_txt` uses no credits in the Alert body, not only a button title.
- One surface only. Do not add another header Badge. Keep `src/client/ui/LICENSE.md`. No `$10` SKU.

## Increment 23 (PR 36)

Kit `Table` for GEO MCP tools on `/ai`.

- `GeoMcpToolsCard` lists `analyze_ai_crawler_access` and `analyze_llms_txt` in the vendored table, not a raw list.
- Caption says credit-free. Presence is not a ranking or citation lever. One surface only.
- Do not convert `AvailableTools` or add another header Badge. Keep `src/client/ui/LICENSE.md`. No `$10` SKU.

## Increment 24 (this delivery)

Crawler map kind filter on the in-app access map.

- Kit outline/default `Button` group: All, Search, Training.
- Training blocks stay a preference, not a ranking defect. Uses no credits.
- One surface only. Do not change the `/ai` GEO MCP card. Do not add another header Badge. Keep `src/client/ui/LICENSE.md`. No `$10` SKU.

## Later increments (not this delivery)

25. Broader chrome migration to the UI kit, one surface at a time.

## Stop conditions

- Do not add a paid plan gate to this page.
- Do not copy proprietary GEO products.
- Do not mention Fitch or Jaime's employer.
- Do not replace daisyUI app-wide in this increment.
- Do not send email, social posts, or outreach.
