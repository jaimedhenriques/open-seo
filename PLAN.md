# SearchCrew SEO/GEO plan

Status: active  
Owner: Helix / SearchCrew  
Date: 2026-09-03  
Repo: [`jaimedhenriques/searchcrew`](https://github.com/jaimedhenriques/searchcrew)  
Product: [searchcrew.ai](https://searchcrew.ai)

## Goal

SearchCrew is SEO+GEO agents plus 10/10 UX. Squadbots runs SearchCrew skills and MCP tools. One shared product surface; no parallel SEO brand.

This plan does not use Jaime's employer, career identity, or Fitch connection.

## Constraints

- UI lock: copy components from [`jaimedhenriques/ui`](https://github.com/jaimedhenriques/ui) (MIT, keep `src/client/ui/LICENSE.md`) first. Use shadcn only when that kit has no equivalent.
- Keep the repo `LICENSE` file, including the OpenSEO MIT upstream notice (Ben Senescu) unmodified.
- Do not call SearchCrew MIT or open source. The product is proprietary; only upstream OpenSEO and vendored UI kit notices are MIT.
- Pay is paused. No $10 hosted SKU, no new Autumn product, no send.
- LICENSE-safe: original SearchCrew code plus MIT-attributed UI kit copies. Do not edit vendored `geo-*` skill bodies.
- One increment per delivery. Tests required. UX bar is 10/10 for the shipped surface. Do not claim a win-rate. Do not claim #1.

## Competitor recut (locked)

- Clodix = autopilot SEO publish. Do not copy a #1-on-Google claim.
- Temso = GEO / AI share of voice.
- Ahrefs / Semrush = classic SEO.
- SearchCrew product is SEO+GEO agents plus 10/10 UX. Not a win-rate product. Not a #1 product.
- Close-now cash is still Squadbots $29 BYO, not SearchCrew.

## Current state

- MCP + SAM tool `analyze_ai_crawler_access` maps named AI crawlers from `robots.txt` with no DataForSEO credits (PR 13 / 15).
- App chrome is daisyUI. The UI kit is shadcn-style New York v4 at `src/client/ui`.
- Keyword Research is a live DataForSEO workspace. First-run is an empty dashed prompt. Hosted billing is paused.

## Increment 1–3 (shipped)

GEO crawler access in-app and public GTM, plus page-level `noai` / `X-Robots-Tag` sample on the GEO report.

## Increment 4 (this delivery)

Apple-level **app** Keyword Research workspace. Not a marketing title, About, or searchcrew.ai page drop.

- Idle workspace shows a **demo persona** keyword list (Lumen Bikes). Demo data only. Uses no credits.
- Built from vendored kit components already in `src/client/ui`: Badge, Card, Table.
- Keep the live search path. Do not open hosted signup. Do not add a $10 SKU.
- Copy: volume / difficulty / intent. No ranking-opportunity, win-rate, or #1 claim.

## Later increments (not this delivery)

5. Broader chrome migration of the live results table to the UI kit.
6. Marketing page on the UI kit, still pay paused, still no #1/win-rate copy.
7. Squadbots skill step that opens the in-app page and writes a research-log line.

## Test gate

- Root `LICENSE` still contains the Ben Senescu MIT upstream notice.
- `src/client/ui/LICENSE.md` stays MIT.
- No plan `monthlyUsd` equals 10. Paid Autumn ids stay solo, pro, agency and annual twins.
- Demo workspace copy has no win-rate, no #1 claim, no open-source product claim.
- vitest for the demo persona module plus `src/shared/billing.test.ts`.

## Stop conditions

- Do not merge PR #14 or #18.
- Do not write on `helix/plan-no-10-sku` or `helix/page-drop-copy`.
- Do not edit live searchcrew.ai or GitHub About.
- Do not add a paid plan gate to this page.
- Do not copy proprietary GEO/SEO products.
- Do not mention Fitch or Jaime's employer.
- Do not replace daisyUI app-wide in this increment.
- Do not send email, social posts, or outreach.
- Do not commit on this branch from a fork of those helix branches.

## Out of scope

HelixAgents. Cardr. Finsyt Vercel. Sourcecontacts. ZoomInfo. Store submit. Personal names on public copy.
