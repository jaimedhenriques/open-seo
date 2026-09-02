# SearchCrew session plan

Date: 3 Sep 2026
Repo: jaimedhenriques/searchcrew (searchcrew.ai)
Graph: PLAN.md, then one increment, then tests. Maker is not the verifier.

## Product
SEO and GEO intelligence for people and AI agents. OpenSEO fork. Public never copycat.

## LICENSE (keep)
- Proprietary SearchCrew work. Do not call the product open source.
- Keep the OpenSEO MIT upstream notice (Ben Senescu) in LICENSE unmodified.
- UI from jaimedhenriques/ui (MIT). Keep that LICENSE.
- Never echo stitch.env. Do not copy grok-bot-0.18-reconstructed.

## ICP
Operators and small SEO/GEO teams who want MCP and API on every plan, including Free.

## Pain
GEO/SEO busywork in expensive suites. Hosted signup and billing stay paused. No $10 hosted SKU.

## Category
Semrush / Ahrefs class. Win on honest pricing, MCP on Free, and UI from jaimedhenriques/ui. Do not invent revenue.

## UX bar
- Marketing and app UI from jaimedhenriques/ui.
- Hosted billing stays paused in public copy until Hythe names it live.
- No $10 hosted SKU in PLANS or marketing TIERS.
- Lineup on main: Free $0, Solo $29, Pro $79, Agency $199.

## Test gate
- LICENSE still contains the Ben Senescu MIT upstream notice.
- No plan monthlyUsd equals 10.
- Paid Autumn ids stay solo, pro, agency and annual twins.
- vitest src/shared/billing.test.ts must pass.

## This increment
Land this PLAN.md and fail-closed no-$10 SKU plus LICENSE notice tests.
Do not merge. Do not open hosted signup. Do not touch HelixAgents.
Next increment: marketing page on jaimedhenriques/ui, with UX, still pay paused.

## Out of scope
HelixAgents. Cardr #279. Finsyt Vercel. Sourcecontacts. ZoomInfo. Store submit. Personal names on public copy.
