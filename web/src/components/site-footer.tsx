import { Link } from "@tanstack/react-router";
import { featureGroups } from "@/lib/feature-pages";

const featureLinks = featureGroups.flatMap((group) =>
  group.pages.map((page) => ({
    label: page.eyebrow,
    href: `/features/${page.slug}`,
  })),
);

export function SiteFooter({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Link
        to="/"
        className="inline-flex min-h-11 items-center text-sm font-semibold text-neutral-900"
      >
        <img
          src="/searchcrew-mark.png"
          alt=""
          className="mr-2 h-6 w-auto"
        />
        SearchCrew
      </Link>

      <div className="mt-6 grid grid-cols-2 gap-8 [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center md:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]">
        <div>
          <p className="font-semibold text-neutral-900">Features</p>
          <div className="mt-2 flex flex-col gap-1.5">
            {featureLinks.slice(0, 3).map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
            <Link to="/features">All features</Link>
          </div>
        </div>

        <div>
          <p className="font-semibold text-neutral-900">AI agents</p>
          <div className="mt-2 flex flex-col gap-1.5">
            <Link to="/features/mcp">SearchCrew MCP</Link>
            <Link to="/google-search-console-mcp">
              Google Search Console MCP
            </Link>
          </div>
        </div>

        <div>
          <p className="font-semibold text-neutral-900">Resources</p>
          <div className="mt-2 flex flex-col gap-1.5">
            <a href="/docs/mcp">MCP</a>
            <a href="/docs/skills">Skills</a>
            <Link to="/library">Strategy Library</Link>
            <Link to="/blogs">Blog</Link>
            <a href="/docs">Docs</a>
          </div>
        </div>

        <div>
          <p className="font-semibold text-neutral-900">Free Tools</p>
          <div className="mt-2 flex flex-col gap-1.5">
            <Link to="/seo-roi-calculator">SEO ROI Calculator</Link>
            <Link to="/backlink-checker">Backlink Checker</Link>
          </div>
        </div>

        <div>
          <p className="font-semibold text-neutral-900">Company</p>
          <div className="mt-2 flex flex-col gap-1.5">
            <Link to="/support">Support</Link>
            <Link to="/roadmap">Roadmap</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms-and-conditions">Terms</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
