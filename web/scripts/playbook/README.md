# SearchCrew keyword research playbook

The public eight-page PDF is generated from editable text and vector shapes. The source retains the original eight plays, practitioner quotations, workflow, checklist and Jeremy Rivera / SEO Arcade / Unscripted credits. The SearchCrew branding adaptation is identified on the closing page.

## Regenerate and check

Requires macOS with the Swift toolchain, AppKit, PDFKit and CryptoKit. No third-party packages or remote services are used. Run from the repository root:

```sh
swift -module-cache-path /private/tmp/searchcrew-swift-module-cache web/scripts/playbook/generate.swift
swift -module-cache-path /private/tmp/searchcrew-swift-module-cache web/scripts/playbook/verify.swift
swift -module-cache-path /private/tmp/searchcrew-swift-module-cache web/scripts/playbook/render.swift web/public/library/keyword-research/keyword-research-playbook.pdf /private/tmp/searchcrew-playbook-review
```

`content.json` holds the guide text. `generate.swift` owns the cobalt/navy layout, page bounds, metadata and three clickable SearchCrew links. It asserts that text stays within the page and each play stays in its assigned section. `verify.swift` checks all content fields, page count, branding, dimensions, metadata and link targets. It optionally accepts an original PDF as its second positional argument for a whitespace-normalized comparison of every play title, endorser, rationale, step, quotation and speaker credit, followed by an optional JSON evidence path.

Inspect all eight rendered pages after changes. Structure checks alone do not prove readable layout, accessible reading order or accurate historical research claims. The generator does not create a tagged PDF; the HTML library remains the primary accessible reading surface.

## Deliberate wording changes

- Old product names and URLs are replaced with SearchCrew and `searchcrew.ai`.
- Introductory and checklist product language says to check available metrics.
- The closing claim that every strategy runs in the product is replaced with links to keyword research and current launch status.
- Practitioner claims, quantities and quotations remain attributed to the original interviews. This branding task does not certify their continuing accuracy or promise results.

Re-generation may change PDF metadata and binary hashes. Compare extracted content and rendered pages as well as the SHA-256 of the delivered file.
