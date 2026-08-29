export const SEO_ROI_CURRENCIES = ["USD", "GBP", "EUR"] as const;

export type SeoRoiCurrency = (typeof SEO_ROI_CURRENCIES)[number];

export type SeoRoiInputs = {
  monthlyOrganicVisits: number;
  visitorToLeadRate: number;
  leadToCustomerRate: number;
  grossProfitPerCustomer: number;
  monthlySeoSpend: number;
  oneTimeSetupCost: number;
};

export type SeoRoiFieldId = keyof SeoRoiInputs;

export type SeoRoiFieldDefinition = {
  id: SeoRoiFieldId;
  label: string;
  help: string;
  group: "traffic" | "value";
  kind: "number" | "percent" | "currency";
  min: number;
  max: number;
  step: number;
};

export type SeoRoiResult = {
  monthlyLeads: number;
  monthlyCustomers: number;
  monthlyGrossProfit: number;
  monthlyNetImpact: number;
  yearOneNetImpact: number;
  yearOneRoi: number | null;
  paybackMonths: number | null;
};

export const DEFAULT_SEO_ROI_INPUTS: SeoRoiInputs = {
  monthlyOrganicVisits: 5_000,
  visitorToLeadRate: 2.5,
  leadToCustomerRate: 10,
  grossProfitPerCustomer: 1_000,
  monthlySeoSpend: 3_000,
  oneTimeSetupCost: 5_000,
};

export const SEO_ROI_FIELDS: readonly SeoRoiFieldDefinition[] = [
  {
    id: "monthlyOrganicVisits",
    label: "Average added visits per month",
    help: "Average monthly organic traffic you expect SEO to add across the first 12 months.",
    group: "traffic",
    kind: "number",
    min: 0,
    max: 1_000_000,
    step: 100,
  },
  {
    id: "visitorToLeadRate",
    label: "Visitor-to-lead rate",
    help: "Share of organic visitors who become a qualified lead.",
    group: "traffic",
    kind: "percent",
    min: 0,
    max: 50,
    step: 0.1,
  },
  {
    id: "leadToCustomerRate",
    label: "Lead-to-customer rate",
    help: "Share of qualified leads that become customers.",
    group: "traffic",
    kind: "percent",
    min: 0,
    max: 100,
    step: 0.5,
  },
  {
    id: "grossProfitPerCustomer",
    label: "Gross profit per customer",
    help: "Revenue minus direct delivery costs for one new customer.",
    group: "value",
    kind: "currency",
    min: 0,
    max: 100_000,
    step: 100,
  },
  {
    id: "monthlySeoSpend",
    label: "Monthly SEO spend",
    help: "Content, tools, agency or team cost in a typical month.",
    group: "value",
    kind: "currency",
    min: 0,
    max: 100_000,
    step: 250,
  },
  {
    id: "oneTimeSetupCost",
    label: "One-time setup cost",
    help: "Technical fixes, research, migration and initial content work.",
    group: "value",
    kind: "currency",
    min: 0,
    max: 250_000,
    step: 500,
  },
] as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function sanitizeSeoRoiInputs(
  inputs: Partial<SeoRoiInputs>,
): SeoRoiInputs {
  return Object.fromEntries(
    SEO_ROI_FIELDS.map((field) => {
      const candidate = inputs[field.id];
      const fallback = DEFAULT_SEO_ROI_INPUTS[field.id];
      const finite = Number.isFinite(candidate) ? Number(candidate) : fallback;
      return [field.id, clamp(finite, field.min, field.max)];
    }),
  ) as SeoRoiInputs;
}

export function calculateSeoRoi(
  rawInputs: Partial<SeoRoiInputs>,
): SeoRoiResult {
  const inputs = sanitizeSeoRoiInputs(rawInputs);
  const monthlyLeads =
    inputs.monthlyOrganicVisits * (inputs.visitorToLeadRate / 100);
  const monthlyCustomers =
    monthlyLeads * (inputs.leadToCustomerRate / 100);
  const monthlyGrossProfit =
    monthlyCustomers * inputs.grossProfitPerCustomer;
  const monthlyNetImpact = monthlyGrossProfit - inputs.monthlySeoSpend;
  const annualInvestment =
    inputs.monthlySeoSpend * 12 + inputs.oneTimeSetupCost;
  const yearOneNetImpact = monthlyGrossProfit * 12 - annualInvestment;
  const yearOneRoi =
    annualInvestment > 0 ? yearOneNetImpact / annualInvestment : null;
  const paybackMonths =
    inputs.oneTimeSetupCost === 0
      ? 0
      : monthlyNetImpact > 0
        ? inputs.oneTimeSetupCost / monthlyNetImpact
        : null;

  return {
    monthlyLeads,
    monthlyCustomers,
    monthlyGrossProfit,
    monthlyNetImpact,
    yearOneNetImpact,
    yearOneRoi,
    paybackMonths,
  };
}

export function formatSeoRoiCurrency(
  value: number,
  currency: SeoRoiCurrency,
): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatSeoRoiDisplayCurrency(
  value: number,
  currency: SeoRoiCurrency,
): string {
  if (Math.abs(value) < 10_000_000) {
    return formatSeoRoiCurrency(value, currency);
  }

  const parts = new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).formatToParts(value);
  const fraction = parts.find((part) => part.type === "fraction")?.value;

  return parts
    .filter(
      (part) =>
        !(
          fraction &&
          /^0+$/.test(fraction) &&
          (part.type === "decimal" || part.type === "fraction")
        ),
    )
    .map((part) => part.value)
    .join("");
}

export function formatSeoRoiNumber(value: number): string {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatSeoRoiPercent(value: number | null): string {
  if (value === null) return "No cost entered";
  return new Intl.NumberFormat("en", {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatSeoRoiPayback(value: number | null): string {
  if (value === null) return "Not reached";
  if (value === 0) return "Immediate";
  return `${value.toFixed(1)} months`;
}

export function formatSeoRoiFieldValue(
  field: SeoRoiFieldDefinition,
  value: number,
  currency: SeoRoiCurrency,
): string {
  if (field.kind === "currency") {
    return formatSeoRoiCurrency(value, currency);
  }
  if (field.kind === "percent") {
    return `${value.toFixed(1)}%`;
  }
  return formatSeoRoiNumber(value);
}
