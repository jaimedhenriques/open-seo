from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BILLING = ROOT / "src" / "shared" / "billing.ts"
LICENSE = ROOT / "LICENSE"
PLAN = ROOT / "PLAN.md"

MONTHLY_USD_TEN = re.compile(
    r"monthlyUsd\s*(?::|===|==)\s*10(?:\.0+)?\b"
)


def fail(msg: str) -> int:
    print(f"FAIL: {msg}", file=sys.stderr)
    return 1


def check_no_ten_dollar_sku() -> int:
    if not BILLING.is_file():
        return fail(f"missing {BILLING.relative_to(ROOT)}")
    text = BILLING.read_text(encoding="utf-8")
    hits = []
    for i, line in enumerate(text.splitlines(), 1):
        if MONTHLY_USD_TEN.search(line) and not line.lstrip().startswith("//"):
            hits.append(f"{i}:{line.strip()}")
    if hits:
        return fail(
            "monthlyUsd === 10 is locked out (no $10 hosted SKU):\n  "
            + "\n  ".join(hits)
        )
    print("ok: no monthlyUsd === 10 in src/shared/billing.ts")
    return 0


def check_license_notice() -> int:
    if not LICENSE.is_file():
        return fail("missing LICENSE")
    text = LICENSE.read_text(encoding="utf-8")
    required = (
        "Ben Senescu",
        "MIT License",
        "OpenSEO",
    )
    missing = [s for s in required if s not in text]
    if missing:
        return fail(
            "LICENSE lost the unmodified OpenSEO MIT notice "
            "(missing: " + ", ".join(missing) + ")"
        )
    print("ok: LICENSE keeps Ben Senescu MIT OpenSEO notice")
    return 0


def check_competitor_recut() -> int:
    if not PLAN.is_file():
        return fail("missing PLAN.md")
    text = PLAN.read_text(encoding="utf-8")
    required = (
        "Clodix",
        "Temso",
        "Ahrefs",
        "Semrush",
        "no win-rate",
        "no #1 claim",
        "Pay paused",
        "No $10 SKU",
        "No send",
        "Squadbots",
    )
    missing = [s for s in required if s not in text]
    if missing:
        return fail("PLAN.md lost the CRO recut (missing: " + ", ".join(missing) + ")")
    banned = (
        "#1-on-Google ranking we copy",
        "guaranteed #1",
        "win-rate %",
    )
    hits = [s for s in banned if s in text]
    if hits:
        return fail("PLAN.md has forbidden ranking copy: " + ", ".join(hits))
    print("ok: PLAN.md keeps CRO competitor recut, no #1/win-rate claim")
    return 0


def main() -> int:
    rc = 0
    rc |= check_no_ten_dollar_sku()
    rc |= check_license_notice()
    rc |= check_competitor_recut()
    if rc == 0:
        print("test_plan_locks: pass")
    return rc


if __name__ == "__main__":
    raise SystemExit(main())
