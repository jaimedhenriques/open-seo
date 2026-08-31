import { createFileRoute } from "@tanstack/react-router";

const SUPPORT_STATUS_URL = "https://searchcrew.ai/support";
const REPOSITORY_URL = "https://github.com/jaimedhenriques/searchcrew";

export const Route = createFileRoute("/_app/support")({
  component: SupportPage,
});

function SupportPage() {
  return (
    <div className="h-full overflow-auto bg-base-100 px-4 py-8 pb-24 md:px-6 md:py-12 md:pb-8">
      <div className="mx-auto max-w-xl">
        <p className="text-sm font-medium text-base-content/40">Support</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Hosted support is opening soon
        </h1>
        <p className="mt-2 text-sm leading-6 text-base-content/60">
          An owner-managed support channel will be published before public
          signup and billing open. The links below show current launch status
          and the source repository.
        </p>

        <div className="mt-8 space-y-3">
          <SupportCard
            title="Support status"
            description="See what is live, what remains paused, and how to use the free calculator."
            href={SUPPORT_STATUS_URL}
            linkText="Open support status"
          />
          <SupportCard
            title="Source repository"
            description="Review the code, self-hosting documentation, and release history."
            href={REPOSITORY_URL}
            linkText="Open repository"
          />
        </div>
      </div>
    </div>
  );
}

function SupportCard({
  title,
  description,
  href,
  linkText,
}: {
  title: string;
  description: string;
  href: string;
  linkText: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block rounded-lg border border-base-300 px-5 py-4 transition-colors hover:border-base-content/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm leading-6 text-base-content/60">
        {description}
      </p>
      <span className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-base-content">
        {linkText}
        <span aria-hidden="true">&rarr;</span>
      </span>
    </a>
  );
}
