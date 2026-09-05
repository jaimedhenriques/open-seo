# SearchCrew screenshot and playbook rebrand

Reviewed 5 September 2026. Scope: customer-facing image branding, local asset references, correct screenshot presentation and the keyword research playbook. No production deployment, signup/billing change or unfinished homepage redesign is included.

## Delivered source changes

- Twelve PNG files carry SearchCrew branding: eight feature views, the README view and three legacy blog files.
- All feature and README screenshots are repository-owned local assets rather than upstream hotlinks.
- The startup blog uses the actual Domain Overview view. The legacy misnamed file is rebranded for direct links but is no longer used for that illustration.
- Feature images retain natural proportions instead of being cropped to 16:10. Actual dimensions reserve layout space. Example captions describe historical sample data; the social card has its own brand-illustration caption.
- Prompt Explorer's brand filter says SearchCrew, while its old citation badge is replaced by “Example”. Both the image and caption explain that this is illustrative, not current citation evidence.
- The eight-page PDF uses cobalt/navy SearchCrew branding, selectable text and three real SearchCrew links. Original plays, quotes, quantities and curator/practitioner credits are preserved. The closing page identifies the branding adaptation and directs readers to current launch status.

## Independent acceptance

The independent `brand_assets_checker` accepted the reviewed assets after a correction round:

- All 12 screenshots: identical dimensions, **zero changed raw RGBA pixels outside approved rectangles**, matching final checksums and zero OpenSEO OCR matches.
- All original colour-profile/colour-description chunks are byte-identical. A second decoder and independent PNG parser verified this; an earlier AppKit-only self-check was insufficient and the affected candidates were rejected.
- The final wordmark includes the selected cobalt RGB `(41, 71, 242)`.
- All eight PDF pages were visually inspected. The verifier checked 86 source fields, original play content and three hyperlinks. PDF SHA-256: `47a148b2e590c63e6a3aa572b6adfa906e5506abd6284c611dbabe8eb1ef4cb1`.
- License notices and authentication, payment, deployment and review-control source remain unchanged.

The checker did not independently run a hosted customer lifecycle or deployment. PDF text is selectable, but the PDF is not PDF/UA-tagged.

## Root-executed checks and limits

The main agent checked all nine feature pages at 1280px and 390px browser widths: every image loaded and no horizontal page overflow appeared. The startup blog's four images loaded at 390px, including the corrected Domain Overview. The temporary viewport override was reset. These are responsive browser checks, not physical-device or full accessibility certification.

Changed-file formatting and website type checking pass. A full website formatting scan also reports 13 unchanged baseline files, recorded in the existing papercut log; those unrelated files are preserved. Initial build/dev attempts lacked permission for the local Cloudflare cache. Permission-scoped website builds pass; CI and exact remote commit evidence must be checked separately before release acceptance.

The maintenance helper pins Sharp 0.34.5 as a direct development dependency, reusing the package already in the lockfile. It is not part of the browser client. See the [screenshot runbook](../web/scripts/BRAND_ASSETS.md) and [PDF runbook](../web/scripts/playbook/README.md).

## Premortem and recovery

Likely regression: a future encoder changes data colours or a future screenshot silently becomes live-result proof. Mitigations are implemented: pinned originals, isolated edit regions, raw-pixel comparison with a second decoder, original profile preservation, sample labels and source-first PDF checks. Revert this isolated source change to recover prior assets. Deployment, full brand-system completion and first-paid-customer gates remain separate work.
