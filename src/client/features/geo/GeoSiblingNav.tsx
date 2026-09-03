import { useNavigate } from "@tanstack/react-router";
import {
  GEO_MCP_NAV,
  geoSiblingLink,
  type GeoSurface,
} from "@/client/features/geo/geoSiblingLink";
import { Button } from "@/client/ui/button";

export function GeoSiblingNav({
  projectId,
  from,
}: {
  projectId: string;
  from: GeoSurface;
}) {
  const navigate = useNavigate();
  const sibling = geoSiblingLink(from);
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          void navigate({ to: sibling.to, params: { projectId } });
        }}
      >
        {sibling.label}
      </Button>
      <Button
        type="button"
        variant="outline"
        title={GEO_MCP_NAV.hint}
        onClick={() => {
          void navigate({ to: GEO_MCP_NAV.to });
        }}
      >
        {GEO_MCP_NAV.label}
      </Button>
      <p className="text-pretty text-sm text-muted-foreground">
        {sibling.hint}
      </p>
    </div>
  );
}
