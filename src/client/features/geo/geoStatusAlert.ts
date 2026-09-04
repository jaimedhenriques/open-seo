import type { AlertVariant } from "@/client/ui/alert";

export function geoStatusAlertVariant(kind: "error" | "info"): AlertVariant {
  return kind === "error" ? "destructive" : "default";
}
