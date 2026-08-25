import {
  AUTUMN_MANAGED_ACCESS_FEATURE_ID,
  AUTUMN_PAID_PLAN_FEATURE_ID,
  AUTUMN_SEO_DATA_BALANCE_FEATURE_ID,
  AUTUMN_SEO_DATA_CREDITS_PER_USD,
  AUTUMN_SEO_DATA_TOPUP_BALANCE_FEATURE_ID,
  AUTUMN_SEO_DATA_TOP_UP_PLAN_ID,
  PLANS,
  autumnProductId,
} from "./billing";

type AutumnFeature = {
  id: string;
  name: string;
  type: "boolean" | "metered";
  consumable?: boolean;
};

type AutumnItem = {
  feature_id: string;
  included?: number;
  reset?: { interval: "month" };
  price?: {
    amount: number;
    interval: "one_off";
    billing_method: "prepaid";
    billing_units: number;
  };
};

type AutumnProduct = {
  id: string;
  name: string;
  auto_enable?: boolean;
  add_on?: boolean;
  price?: { amount: number; interval: "month" | "year" };
  items: AutumnItem[];
};

export function buildAutumnFeatures(): AutumnFeature[] {
  return [
    {
      id: AUTUMN_PAID_PLAN_FEATURE_ID,
      name: "Paid Plan",
      type: "boolean",
    },
    {
      id: AUTUMN_MANAGED_ACCESS_FEATURE_ID,
      name: "Managed Service Access",
      type: "boolean",
    },
    {
      id: AUTUMN_SEO_DATA_BALANCE_FEATURE_ID,
      name: "Usage Credits",
      type: "metered",
      consumable: true,
    },
    {
      id: AUTUMN_SEO_DATA_TOPUP_BALANCE_FEATURE_ID,
      name: "Top-up Credits",
      type: "metered",
      consumable: true,
    },
  ];
}

export function buildAutumnProducts(): AutumnProduct[] {
  const tiers = PLANS.flatMap<AutumnProduct>((plan) => {
    // Monthly credits reset each cycle on every tier, including Free; only
    // top-ups roll over.
    const grants: AutumnItem[] = [
      { feature_id: AUTUMN_MANAGED_ACCESS_FEATURE_ID },
      {
        feature_id: AUTUMN_SEO_DATA_BALANCE_FEATURE_ID,
        included: plan.monthlyCredits,
        reset: { interval: "month" },
      },
    ];

    if (plan.monthlyUsd === 0) {
      return [
        {
          id: plan.id,
          name: plan.name,
          auto_enable: true,
          items: grants,
        },
      ];
    }

    const paid = [{ feature_id: AUTUMN_PAID_PLAN_FEATURE_ID }, ...grants];
    return [
      {
        id: autumnProductId(plan.id, "monthly"),
        name: plan.name,
        price: { amount: plan.monthlyUsd, interval: "month" },
        items: paid,
      },
      {
        id: autumnProductId(plan.id, "annual"),
        name: `${plan.name} (Annual)`,
        price: { amount: plan.annualUsd, interval: "year" },
        items: paid,
      },
    ];
  });

  return [
    ...tiers,
    {
      id: AUTUMN_SEO_DATA_TOP_UP_PLAN_ID,
      name: "Credit Top-up",
      add_on: true,
      items: [
        {
          feature_id: AUTUMN_SEO_DATA_TOPUP_BALANCE_FEATURE_ID,
          price: {
            amount: 1,
            interval: "one_off",
            billing_method: "prepaid",
            billing_units: AUTUMN_SEO_DATA_CREDITS_PER_USD,
          },
        },
      ],
    },
  ];
}
