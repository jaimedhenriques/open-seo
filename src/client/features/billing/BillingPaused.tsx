export function BillingBrandMark() {
  return (
    <img
      src="/searchcrew-mark.png"
      alt="SearchCrew"
      className="mx-auto h-12 w-auto"
    />
  );
}

export function BillingPaused() {
  return (
    <div className="w-full max-w-sm space-y-5 text-center">
      <BillingBrandMark />
      <div>
        <h1 className="text-xl font-semibold">Hosted billing is paused</h1>
        <p className="mt-2 text-sm leading-6 text-base-content/60">
          Plans and checkout will open after production billing, support, legal,
          and account-recovery checks pass.
        </p>
      </div>
      <a
        href="https://searchcrew.ai/get-started"
        className="btn min-h-11 w-full"
      >
        View launch status
      </a>
    </div>
  );
}
