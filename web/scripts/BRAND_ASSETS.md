# SearchCrew screenshot maintenance

Run from the repository root with macOS/Swift and the website's locked dependencies installed:

```sh
corepack pnpm@10.30.1 --dir web install --frozen-lockfile
node web/scripts/prepare-screenshots.mjs
swift -module-cache-path /private/tmp/searchcrew-brand-module-cache web/scripts/rebrand-screenshots.swift
node web/scripts/finalize-screenshots.mjs
```

The preparation step restores checksum-pinned originals. Blog originals come from canonical commit `f2bf93a5fc240362b22bf83a161df75a96402189`, never from already-branded current files. Feature/README originals have pinned public URLs and SHA-256 values in `screenshot-sources.json`. If a remote source changes or disappears, stop and restore the reviewed evidence archive; do not accept new bytes under an old checksum. A shallow clone must fetch the named commit first.

The Swift utility renders text candidates into ignored local evidence. **Those candidate images must never be published:** AppKit normalizes some PNG colours and profiles. The finalizer copies only approved rectangles onto the original raw RGBA channels, verifies a lossless PNG roundtrip, preserves original colour-profile chunks and replaces public files only after the entire batch validates. Sharp 0.34.5 is an explicit maintenance dependency, already present transitively in the original lockfile. It is not imported by the website client.

Final evidence: `.helix/evidence/brand-assets/pixel-checks.json`. Require zero changed pixels outside the declared rectangles and byte-identical original colour metadata. Independently compare decoded RGBA channels with a second decoder; a same-library roundtrip is insufficient. Use OCR and visual review for all 12 assets, including tiny header names and the Prompt Explorer sample label.

Prompt Explorer's brand input is SearchCrew, but the historical result badge becomes **Example**, with an on-image illustrative label and an explicit no-current-citation caption. This avoids fabricating evidence of a model mentioning SearchCrew. Metrics, sample domains and response text remain unchanged.

The startup blog uses `/screenshots/domain-overview.png` because its old, misleadingly named Domain Overview file actually showed Backlinks. That legacy public file is rebranded for existing direct links but is no longer used as a Domain Overview illustration.

Feature images use local URLs, truthful alt text, actual dimensions and natural aspect ratios. AI Crawler Access uses a brand social card and has a separate caption. Required upstream license notices remain untouched.

Before handoff: run formatting/type checks and the full website build, visually inspect affected pages at desktop and narrow widths, review all eight playbook pages with the separate [playbook workflow](playbook/README.md), and obtain independent acceptance. A local build/PR does not prove deployment or paid-customer readiness.
