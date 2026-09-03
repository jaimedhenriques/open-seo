from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
def fail(m):
    print("FAIL", m)
    raise SystemExit(1)
title = "SearchCrew — SEO and GEO for people and AI agents"
about = "SEO and GEO intelligence for people and AI agents."
pkg = (ROOT / "package.json").read_text()
if about not in pkg: fail("package.json missing GitHub About description")
root = (ROOT / "src/routes/__root.tsx").read_text()
if title not in root: fail("app document title missing")
home = (ROOT / "web/src/routes/_marketing/index.tsx").read_text()
if title not in home: fail("marketing title missing")
land = (ROOT / "web/src/components/landing-page.tsx").read_text()
if "keyword research" not in land: fail("demo seed keyword research missing")
if "open source seo" in land.lower(): fail("landing table still says open source seo")
lic = (ROOT / "LICENSE").read_text()
if "Ben Senescu" not in lic or "OpenSEO" not in lic: fail("LICENSE notice lost")
print("ok")
