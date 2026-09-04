import {
  GEO_MCP_BADGE,
  GEO_MCP_GROUP_LABEL,
  GEO_MCP_HINT,
  GEO_MCP_TABLE_CAPTION,
  GEO_MCP_TABLE_HEADS,
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/ui/table";

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
        <Table>
          <TableCaption>{GEO_MCP_TABLE_CAPTION}</TableCaption>
          <TableHeader>
            <TableRow>
              {GEO_MCP_TABLE_HEADS.map((head) => (
                <TableHead key={head}>{head}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {GEO_MCP_TOOLS.map((tool) => (
              <TableRow key={tool.name}>
                <TableCell className="font-mono">{tool.name}</TableCell>
                <TableCell className="whitespace-normal text-pretty text-muted-foreground">
                  {tool.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
