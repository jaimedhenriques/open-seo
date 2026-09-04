import {
  GEO_MCP_BADGE,
  GEO_MCP_GROUP_LABEL,
  GEO_MCP_HINT,
  GEO_MCP_TOOLS,
} from "@/client/features/geo/geoMcpTools";
import { Badge } from "@/client/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/client/ui/card";

export function GeoMcpToolsCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>{GEO_MCP_GROUP_LABEL}</CardTitle>
          <Badge variant="outline">{GEO_MCP_BADGE}</Badge>
        </div>
        <CardDescription>{GEO_MCP_HINT}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {GEO_MCP_TOOLS.map((tool) => (
            <li key={tool.name} className="flex flex-col gap-0.5">
              <span className="font-mono text-sm font-medium text-foreground">
                {tool.name}
              </span>
              <p className="text-pretty text-sm text-muted-foreground">
                {tool.description}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
