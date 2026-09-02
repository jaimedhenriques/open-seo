import * as React from "react";
import { cn } from "@/client/ui/utils";

const badgeBase =
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3";

const badgeVariantClass = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  destructive: "bg-destructive text-white dark:bg-destructive/60",
  outline: "border-border text-foreground",
  ghost: "text-foreground",
  link: "text-primary underline-offset-4",
} as const;

export type BadgeVariant = keyof typeof badgeVariantClass;

function badgeVariants(opts: {
  variant?: BadgeVariant;
  className?: string;
}): string {
  return cn(
    badgeBase,
    badgeVariantClass[opts.variant ?? "default"],
    opts.className,
  );
}

export function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & { variant?: BadgeVariant }) {
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={badgeVariants({ variant, className })}
      {...props}
    />
  );
}
