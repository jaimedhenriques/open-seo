# SearchCrew homepage design QA

## Scope

- Reference: `https://www.alpha-sense.com/`
- Implementation: `http://localhost:4322/`
- State: public homepage, unauthenticated
- Desktop review: approximately 1280 x 720
- Mobile review: 390 x 844 CSS viewport, device scale factor 1
- Final desktop capture: `.helix/evidence/alphasense-proposition/home-desktop.png`
- Final mobile capture: `.helix/evidence/alphasense-proposition/home-mobile.png`

The reference and implementation were captured and compared in the same Codex browser session. The review evaluates information hierarchy, product-proof placement, conversion paths, responsive behavior, and interaction quality. The implementation intentionally retains SearchCrew's own brand, copy, routes, product capture, and visual identity.

## Visual truth

The useful AlphaSense patterns are a compact announcement bar, a conventional navigation with a strong primary action, a large left-aligned outcome statement, product proof immediately after the proposition, outcome-led workflow sections, and a decisive closing CTA. SearchCrew applies those structural patterns without copying AlphaSense code, assets, copy, trademarks, customer logos, or unsupported proof.

## Findings and fixes

### Resolved before handoff

- P2: The first draft repeated the announcement in both the top bar and hero, and the oversized heading pushed the primary actions below the fold. The duplicate hero pill was removed and the display scale was reduced to keep the proposition and actions visible.
- P2: The first draft used a CSS-drawn dashboard illustration. It was replaced with a real SearchCrew domain-research product capture already present in the repository.
- P3: Product detail was too small at mobile width. The capture now uses a 4:3 responsive crop anchored to the most informative top-left region.
- P2: Bright orange small text and the MCP button missed WCAG AA contrast on light surfaces. Small orange text and orange-backed controls now use darker brand-ink values: 4.85:1 on the hero canvas, 5.45:1 on white, and 5.54:1 in the MCP section. Large display text and orange details on dark surfaces retain the brighter brand orange.

### Final review

- No P0, P1, or P2 visual defects remain.
- Desktop hierarchy is clear from proposition to proof to workflows to agent integration to final CTA.
- The mobile layout has no horizontal overflow: inner width, document client width, and document scroll width all measured 390px.
- The mobile menu opens and exposes Explore platform, Sign in, Features, Pricing, Launch status, and resource routes.
- Focus treatments, 44px minimum navigation targets, reduced-motion handling, descriptive image text, and semantic headings are retained.
- Browser console showed no application errors. Local analytics emitted only expected localhost-ignore warnings.

## Result

Passed for code review. Production deployment and hosted signup remain outside this design change.
