import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  DEFAULT_SEO_ROI_INPUTS,
  SEO_ROI_CURRENCIES,
  SEO_ROI_FIELDS,
  calculateSeoRoi,
  formatSeoRoiCurrency,
  formatSeoRoiDisplayCurrency,
  formatSeoRoiFieldValue,
  formatSeoRoiNumber,
  formatSeoRoiPayback,
  formatSeoRoiPercent,
  sanitizeSeoRoiInputs,
  type SeoRoiCurrency,
  type SeoRoiFieldDefinition,
  type SeoRoiFieldId,
  type SeoRoiInputs,
  type SeoRoiResult,
} from "@/lib/seo-roi-calculator";

type CopyState = "idle" | "copied" | "error";

const fieldGroups = [
  {
    id: "traffic" as const,
    legend: "Traffic & conversion",
    description:
      "Model the path from additional organic visits to new customers.",
  },
  {
    id: "value" as const,
    legend: "Value & cost",
    description:
      "Use gross profit and include the full cost of producing the SEO work.",
  },
];

function buildSummary(
  inputs: SeoRoiInputs,
  result: SeoRoiResult,
  currency: SeoRoiCurrency,
): string {
  return [
    "SEO ROI estimate",
    `Additional organic visits: ${formatSeoRoiNumber(inputs.monthlyOrganicVisits)} / month`,
    `Monthly leads: ${formatSeoRoiNumber(result.monthlyLeads)}`,
    `Monthly customers: ${formatSeoRoiNumber(result.monthlyCustomers)}`,
    `Monthly net impact: ${formatSeoRoiCurrency(result.monthlyNetImpact, currency)}`,
    `Year-one net impact: ${formatSeoRoiCurrency(result.yearOneNetImpact, currency)}`,
    `Year-one ROI: ${formatSeoRoiPercent(result.yearOneRoi)}`,
    `Setup-cost payback: ${formatSeoRoiPayback(result.paybackMonths)}`,
    "Planning estimate. Replace defaults with observed conversion and margin data before making budget commitments.",
  ].join("\n");
}

export function SeoRoiCalculator() {
  const [inputs, setInputs] = useState<SeoRoiInputs>(DEFAULT_SEO_ROI_INPUTS);
  const [currency, setCurrency] = useState<SeoRoiCurrency>("USD");
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [resetRevision, setResetRevision] = useState(0);
  const result = useMemo(() => calculateSeoRoi(inputs), [inputs]);
  const annualInvestment =
    inputs.monthlySeoSpend * 12 + inputs.oneTimeSetupCost;

  const updateValue = (fieldId: SeoRoiFieldId, value: number) => {
    setInputs((current) =>
      sanitizeSeoRoiInputs({ ...current, [fieldId]: value }),
    );
    setCopyState("idle");
  };

  const reset = () => {
    setInputs(DEFAULT_SEO_ROI_INPUTS);
    setCurrency("USD");
    setCopyState("idle");
    setResetRevision((current) => current + 1);
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(
        buildSummary(inputs, result, currency),
      );
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  };

  return (
    <section aria-labelledby="calculator-heading" className="mt-10">
      <div className="flex flex-col gap-5 border-y border-[var(--color-border-subtle)] py-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="calculator-heading"
            className="text-2xl font-semibold tracking-[-0.025em] text-neutral-950"
          >
            Set your assumptions
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--color-brand-muted)]">
            Use a conservative monthly average for year one. Results update
            instantly.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <label className="block text-sm font-medium text-neutral-800">
            Currency unit
            <select
              name="seo-roi-currency"
              autoComplete="off"
              value={currency}
              onChange={(event) => {
                setCurrency(event.target.value as SeoRoiCurrency);
                setCopyState("idle");
              }}
              className="mt-1 block h-11 rounded-xl border border-[var(--color-border-subtle)] bg-white px-3 text-base text-neutral-950 transition-[border-color,box-shadow] focus:border-neutral-950 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-accent)] focus:ring-offset-2"
            >
              {SEO_ROI_CURRENCIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={reset}
            className="h-11 touch-manipulation rounded-xl border border-[var(--color-border-subtle)] bg-white px-4 text-sm font-medium text-neutral-800 transition-[background-color,border-color,color,transform] duration-150 hover:border-neutral-950 hover:text-neutral-950 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-accent)] focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
          >
            Reset
          </button>
          <p className="w-full text-xs leading-5 text-neutral-600 sm:w-auto sm:max-w-32">
            Labels change; values are not converted.
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="sticky top-3 z-20 mt-5 rounded-2xl bg-neutral-950 px-4 py-3 text-white shadow-lg shadow-neutral-950/15 lg:hidden"
      >
        <div className="flex min-w-0 items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium text-neutral-400">
              Year-one net impact
            </p>
            <p className="mt-0.5 truncate text-2xl font-semibold tracking-[-0.03em] tabular-nums">
              {formatSeoRoiDisplayCurrency(result.yearOneNetImpact, currency)}
            </p>
          </div>
          <div className="shrink-0 border-l border-neutral-700 pl-4 text-right">
            <p className="text-xs text-neutral-400">ROI</p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums text-[var(--color-brand-accent)]">
              {formatSeoRoiPercent(result.yearOneRoi)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="space-y-9">
          {fieldGroups.map((group) => (
            <fieldset
              key={group.id}
              aria-describedby={`${group.id}-description`}
              className="border-t border-[var(--color-border-subtle)] pt-5"
            >
              <legend className="text-base font-semibold text-neutral-950">
                {group.legend}
              </legend>
              <p
                id={`${group.id}-description`}
                className="mt-1 max-w-2xl text-sm leading-5 text-[var(--color-brand-muted)]"
              >
                {group.description}
              </p>
              <div className="mt-4 divide-y divide-[var(--color-border-subtle)] border-b border-[var(--color-border-subtle)]">
                {SEO_ROI_FIELDS.filter((field) => field.group === group.id).map(
                  (field) => (
                    <AssumptionField
                      key={`${field.id}-${resetRevision}`}
                      field={field}
                      value={inputs[field.id]}
                      currency={currency}
                      onChange={(value) => updateValue(field.id, value)}
                    />
                  ),
                )}
              </div>
            </fieldset>
          ))}
        </div>

        <aside
          id="seo-roi-results"
          aria-label="SEO ROI results"
          className="scroll-mt-6 overflow-hidden rounded-2xl bg-neutral-950 text-white shadow-xl shadow-neutral-950/10 lg:sticky lg:top-6"
        >
          <div className="bg-[var(--color-brand-accent)] px-5 py-6 text-neutral-950 sm:px-6">
            <p className="text-sm font-medium">Estimated year-one net impact</p>
            <output
              aria-live="polite"
              aria-atomic="true"
              aria-label={`Estimated year-one net impact: ${formatSeoRoiCurrency(result.yearOneNetImpact, currency)}`}
              title={formatSeoRoiCurrency(result.yearOneNetImpact, currency)}
              className="mt-2 block break-words text-4xl font-semibold tracking-[-0.035em] tabular-nums sm:text-5xl"
            >
              {formatSeoRoiDisplayCurrency(result.yearOneNetImpact, currency)}
            </output>
            <p className="mt-2 text-sm font-medium">
              {result.yearOneNetImpact > 0
                ? "Positive estimated return"
                : result.yearOneNetImpact < 0
                  ? "Negative estimated return"
                  : "Estimated break-even"}
            </p>

            <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-neutral-950/20">
              <ResultMetric
                label="Year-one ROI"
                value={formatSeoRoiPercent(result.yearOneRoi)}
              />
              <ResultMetric
                label="Setup payback"
                value={formatSeoRoiPayback(result.paybackMonths)}
              />
            </dl>
          </div>

          <dl className="divide-y divide-neutral-800 px-5 sm:px-6">
            <ResultRow
              label="Monthly leads"
              value={formatSeoRoiNumber(result.monthlyLeads)}
            />
            <ResultRow
              label="Monthly customers"
              value={formatSeoRoiNumber(result.monthlyCustomers)}
            />
            <ResultRow
              label="Monthly gross profit"
              value={formatSeoRoiDisplayCurrency(
                result.monthlyGrossProfit,
                currency,
              )}
            />
            <ResultRow
              label="Monthly net impact"
              value={formatSeoRoiDisplayCurrency(
                result.monthlyNetImpact,
                currency,
              )}
              note={
                result.monthlyNetImpact < 0 ? "Below monthly cost" : undefined
              }
            />
            <ResultRow
              label="Year-one investment"
              value={formatSeoRoiDisplayCurrency(annualInvestment, currency)}
            />
          </dl>

          <div className="border-t border-neutral-800 p-5 sm:p-6">
            <button
              type="button"
              onClick={() => void copySummary()}
              className="flex min-h-11 w-full touch-manipulation items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-neutral-950 transition-[background-color,transform] duration-150 hover:bg-neutral-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 motion-reduce:transform-none motion-reduce:transition-none"
            >
              {copyState === "copied"
                ? "Estimate copied"
                : copyState === "error"
                  ? "Copy failed — try again"
                  : "Copy estimate"}
            </button>
            <p role="status" aria-live="polite" className="sr-only">
              {copyState === "copied"
                ? "Estimate copied to clipboard."
                : copyState === "error"
                  ? "The estimate could not be copied. Try again or copy the values manually."
                  : ""}
            </p>
            <p className="mt-3 text-xs leading-5 text-neutral-400">
              Planning estimate. Replace defaults with observed conversion and
              margin data before making budget commitments.
            </p>
          </div>
        </aside>
      </div>

      <details className="group mt-6 border-y border-[var(--color-border-subtle)] bg-white/55 px-5 py-4">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-accent)] focus-visible:ring-offset-4 [&::-webkit-details-marker]:hidden">
          How this is calculated
          <span
            aria-hidden="true"
            className="seo-roi-disclosure-icon text-lg font-normal text-[var(--color-brand-accent-ink)] group-open:rotate-45"
          >
            +
          </span>
        </summary>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--color-brand-muted)]">
          Monthly leads equal additional visits multiplied by the
          visitor-to-lead rate. Monthly customers apply the close rate. Year-one
          net impact subtracts 12 months of SEO spend and the one-time setup
          cost from 12 months of gross profit. ROI divides that net impact by
          total year-one SEO investment.
        </p>
      </details>
    </section>
  );
}

function AssumptionField({
  field,
  value,
  currency,
  onChange,
}: {
  field: SeoRoiFieldDefinition;
  value: number;
  currency: SeoRoiCurrency;
  onChange: (value: number) => void;
}) {
  const inputId = `seo-roi-${field.id}`;
  const helpId = `${inputId}-help`;
  const limitsId = `${inputId}-limits`;
  const [draft, setDraft] = useState(String(value));
  const [validationState, setValidationState] = useState<
    { kind: "empty" } | { kind: "adjusted"; value: number } | null
  >(null);
  const hasRange = field.kind === "percent";
  const rangeProgress =
    field.max === field.min
      ? 0
      : ((value - field.min) / (field.max - field.min)) * 100;

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const normalizeDraft = () => {
    const parsed = Number(draft);
    if (draft.trim() === "" || !Number.isFinite(parsed)) {
      setDraft(String(value));
      setValidationState({ kind: "empty" });
      return;
    }

    const normalized = Math.min(field.max, Math.max(field.min, parsed));
    setDraft(String(normalized));
    onChange(normalized);
    setValidationState(
      normalized === parsed
        ? null
        : { kind: "adjusted", value: normalized },
    );
  };

  return (
    <div className="scroll-mt-28 grid gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_11rem] sm:items-start sm:py-6">
      <div>
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-neutral-950"
        >
          {field.label}
        </label>
        <p
          id={helpId}
          className="mt-1 max-w-xl text-sm leading-5 text-[var(--color-brand-muted)]"
        >
          {field.help}
        </p>
      </div>

      <div>
        <div className="relative rounded-xl border border-[var(--color-border-subtle)] bg-white shadow-sm shadow-neutral-950/[0.02] transition-[border-color,box-shadow] focus-within:border-neutral-950 focus-within:ring-2 focus-within:ring-[var(--color-brand-accent)] focus-within:ring-offset-2">
          <input
            id={inputId}
            name={field.id}
            autoComplete="off"
            type="number"
            inputMode="decimal"
            min={field.min}
            max={field.max}
            step={field.step}
            value={draft}
            aria-describedby={`${helpId} ${limitsId}`}
            onChange={(event) => {
              const nextDraft = event.currentTarget.value;
              setDraft(nextDraft);
              setValidationState(null);
              const next = event.currentTarget.valueAsNumber;
              if (
                Number.isFinite(next) &&
                next >= field.min &&
                next <= field.max
              ) {
                onChange(next);
              }
            }}
            onBlur={normalizeDraft}
            className="h-12 w-full rounded-xl bg-transparent px-3 pr-14 text-right text-base font-medium tabular-nums text-neutral-950 outline-none"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-neutral-500"
          >
            {field.kind === "percent"
              ? "%"
              : field.kind === "currency"
                ? currency
                : "visits"}
          </span>
        </div>
        <p id={limitsId} className="mt-2 text-xs leading-5 text-neutral-600">
          {validationState?.kind === "empty"
            ? "Enter a number to update this assumption."
            : validationState?.kind === "adjusted"
              ? `Adjusted to ${formatSeoRoiFieldValue(field, validationState.value, currency)}.`
              : `${formatSeoRoiFieldValue(field, field.min, currency)} to ${formatSeoRoiFieldValue(field, field.max, currency)}`}
        </p>
      </div>

      {hasRange ? (
        <div className="sm:col-span-2">
          <input
            type="range"
            name={`${field.id}-slider`}
            min={field.min}
            max={field.max}
            step={field.step}
            value={value}
            aria-label={`${field.label} slider`}
            aria-describedby={helpId}
            aria-valuetext={formatSeoRoiFieldValue(field, value, currency)}
            onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
            style={{ "--range-progress": `${rangeProgress}%` } as CSSProperties}
            className="seo-roi-range block w-full focus:outline-none"
          />
          <div
            aria-hidden="true"
            className="mt-1 flex items-center justify-between gap-3 text-xs text-neutral-600"
          >
            <span>{formatSeoRoiFieldValue(field, field.min, currency)}</span>
            <span className="font-medium text-neutral-700">
              {formatSeoRoiFieldValue(field, value, currency)}
            </span>
            <span>{formatSeoRoiFieldValue(field, field.max, currency)}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/45 px-3 py-3.5">
      <dt className="text-xs font-medium text-neutral-800">{label}</dt>
      <dd className="mt-1 break-words text-lg font-semibold tabular-nums text-neutral-950">
        {value}
      </dd>
    </div>
  );
}

function ResultRow({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 py-4">
      <dt className="min-w-0 text-sm text-neutral-400">
        {label}
        {note ? (
          <span className="mt-1 block text-xs leading-4 text-amber-300">
            {note}
          </span>
        ) : null}
      </dt>
      <dd className="max-w-36 break-words text-right text-base font-semibold tabular-nums text-white">
        {value}
      </dd>
    </div>
  );
}
