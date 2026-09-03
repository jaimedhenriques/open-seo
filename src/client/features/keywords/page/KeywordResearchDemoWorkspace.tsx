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
import {
  DEMO_KEYWORD_ROWS,
  DEMO_PERSONA,
  DEMO_WORKSPACE_COPY,
  demoIntentLabel,
  formatDemoCpc,
  formatDemoVolume,
} from "@/client/features/keywords/demoPersona";

export function KeywordResearchDemoWorkspace() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Persona"
          value={DEMO_PERSONA.brand}
          hint={DEMO_PERSONA.kind}
        />
        <SummaryCard
          title="Seed"
          value={DEMO_PERSONA.seed}
          hint={DEMO_PERSONA.market}
        />
        <SummaryCard
          title="Keywords"
          value={String(DEMO_KEYWORD_ROWS.length)}
          hint="Sample list for this shop"
        />
        <SummaryCard
          title="Credits"
          value={DEMO_WORKSPACE_COPY.creditsHint}
          hint="Hosted billing is paused"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <CardTitle>{DEMO_WORKSPACE_COPY.title}</CardTitle>
            <CardDescription>{DEMO_WORKSPACE_COPY.description}</CardDescription>
          </div>
          <Badge variant="secondary">{DEMO_WORKSPACE_COPY.badge}</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>{DEMO_WORKSPACE_COPY.caption}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead>Intent</TableHead>
                <TableHead className="text-right">Difficulty</TableHead>
                <TableHead className="text-right">CPC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEMO_KEYWORD_ROWS.map((row) => (
                <TableRow key={row.keyword}>
                  <TableCell className="font-medium">{row.keyword}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatDemoVolume(row.searchVolume)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {demoIntentLabel(row.intent)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.keywordDifficulty ?? "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatDemoCpc(row.cpc)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="gap-3 py-4">
      <CardHeader className="px-4">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-base tabular-nums">{value}</CardTitle>
        <p className="text-pretty text-xs text-muted-foreground">{hint}</p>
      </CardHeader>
    </Card>
  );
}
