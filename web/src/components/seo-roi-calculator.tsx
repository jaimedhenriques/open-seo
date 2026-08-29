import { useMemo, useState } from "react";
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
    legend: "Traffic and conversion",
    description: "Use first-year monthly averages from analytics or a conservative forecast.",
  },
  {
    id: "value" as const,
    legend: "Value and cost",
    description: "Use gross profit and include the full cost of producing the SEO work.",
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
  const result = useMemo(() => calculateSeoRoi(inputs), [inputs]);

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
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildSummary(inputs, result, currency));
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  };

  return (
    <section aria-labelledby="calculator-heading" className="mt-10">
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <div className="flex flex-col gap-4 border-b border-[var(--color-border-subtle)] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="calculator-heading"
                className="text-2xl font-semibold tracking-tight text-neutral-950"
              >
                Set your assumptions
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--color-brand-muted)]">
                Start with a conservative monthly average for year one. Every result updates as you type.
              </p>
            </div>
            <div className="flex items-end gap-3">
              <label className="block text-sm font-medium text-neutral-800">
                Currency
                <select
                  value={currency}
                  onChange={(event) => {
                    setCurrency(event.target.value as SeoRoiCurrency);
                    setCopyState("idle");
                  }}
                  className="mt-1 block h-11 rounded-lg border border-[var(--color-border-subtle)] bg-white px-3 text-base text-neutral-950 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
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
                className="h-11 rounded-lg border border-[var(--color-border-subtle)] bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-950 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-accent)] focus-visible:ring-offset-2"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-5">
            {fieldGroups.map((group) => (
              <fieldset
                key={group.id}
                aria-describedby={`${group.id}-description`}
                className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-white"
              >
                <legend className="sr-only">{group.legend}</legend>
                <div className="border-b border-[var(--color-border-subtle)] bg-[#faf8f5] px-4 py-3.5 sm:px-5">
                  <p
                    aria-hidden="true"
                    className="text-base font-semibold text-neutral-950"
                  >
                    {group.legend}
                  </p>
                  <p
                    id={`${group.id}-description`}
                    className="mt-1 text-sm leading-5 text-[var(--color-brand-muted)]"
                  >
                    {group.description}
                  </p>
                </div>
                <div className="divide-y divide-[var(--color-border-subtle)]">
                  {SEO_ROI_FIELDS.filter(
                    (field) => field.group === group.id,
                  ).map((field) => (
                    <AssumptionField
                      key={field.id}
                      field={field}
                      value={inputs[field.id]}
                      currency={currency}
                      onChange={(value) => updateValue(field.id, value)}
                    />
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </div>

        <aside className="overflow-hidden rounded-xl bg-neutral-950 text-white lg:sticky lg:top-6">
          <div className="bg-[var(--color-brand-accent)] px-5 py-5 text-neutral-950">
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
          </div>

          <dl className="divide-y divide-neutral-800 px-5">
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
              note={result.monthlyNetImpact < 0 ? "Below monthly cost" : undefined}
            />
            <ResultRow
              label="Year-one ROI"
              value={formatSeoRoiPercent(result.yearOneRoi)}
            />
            <ResultRow
              label="Setup-cost payback"
              value={formatSeoRoiPayback(result.paybackMonths)}
              note={
                result.paybackMonths === null
                  ? "Payback is not reached with these assumptions"
                  : undefined
              }
            />
          </dl>

          <div className="border-t border-neutral-800 p-5">
            <button
              type="button"
              onClick={() => void copySummary()}
              className="flex min-h-11 w-full items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              {copyState === "copied"
                ? "Copied"
                : copyState === "error"
                  ? "Copy failed"
                  : "Copy estimate"}
            </button>
            <p role="status" aria-live="polite" className="sr-only">
              {copyState === "copied"
                ? "Estimate copied to clipboard."
                : copyState === "error"
                  ? "The estimate could not be copied."
                  : ""}
            </p>
            <p className="mt-3 text-xs leading-5 text-neutral-400">
              Planning estimate. Replace defaults with observed conversion and margin data before making budget commitments.
            </p>
          </div>
        </aside>
      </div>

      <details className="mt-6 rounded-xl border border-[var(--color-border-subtle)] bg-white px-5 py-4">
        <summary className="cursor-pointer text-sm font-semibold text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-accent)] focus-visible:ring-offset-4">
          How this is calculated
        </summary>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--color-brand-muted)]">
          Monthly leads equal additional visits multiplied by the visitor-to-lead rate. Monthly customers apply the close rate. Year-one net impact subtracts 12 months of SEO spend and the one-time setup cost from 12 months of gross profit. ROI divides that net impact by total year-one SEO investment.
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
  const rangeId = `${inputId}-range`;
  const rangeDescriptionId = `${inputId}-range-description`;

  return (
    <div className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_10rem] sm:items-start sm:p-5">
      <div>
        <label htmlFor={inputId} className="text-sm font-semibold text-neutral-950">
          {field.label}
        </label>
        <p id={helpId} className="mt-1 text-sm leading-5 text-[var(--color-brand-muted)]">
          {field.help}
        </p>
      </div>

      <div className="relative">
        <input
          id={inputId}
          type="number"
          inputMode="decimal"
          min={field.min}
          max={field.max}
          step={field.step}
          value={value}
          aria-describedby={helpId}
          onChange={(event) => {
            const next = event.currentTarget.valueAsNumber;
            onChange(Number.isFinite(next) ? next : 0);
          }}
          className="h-11 w-full rounded-lg border border-[var(--color-border-subtle)] bg-white px-3 pr-12 text-right text-base font-medium tabular-nums text-neutral-950 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
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

      <div className="sm:col-span-2">
        <input
          id={rangeId}
          type="range"
          min={field.min}
          max={field.max}
          step={field.step}
          value={value}
          aria-label={`${field.label} slider`}
          aria-describedby={`${helpId} ${rangeDescriptionId}`}
          onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
          className="block h-11 w-full cursor-pointer accent-[var(--color-brand-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-accent)] focus-visible:ring-offset-2"
        />
        <div
          id={rangeDescriptionId}
          className="flex items-center justify-between gap-3 text-xs text-neutral-500"
        >
          <span>{formatSeoRoiFieldValue(field, field.min, currency)}</span>
          <span className="font-medium text-neutral-700">
            {formatSeoRoiFieldValue(field, value, currency)}
          </span>
          <span>{formatSeoRoiFieldValue(field, field.max, currency)}</span>
        </div>
      </div>
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
        {note ? <span className="mt-1 block text-xs leading-4 text-amber-300">{note}</span> : null}
      </dt>
      <dd className="max-w-32 break-words text-right text-base font-semibold tabular-nums text-white">
        {value}
      </dd>
    </div>
  );
}
