import { useEffect, useId, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScanSearch } from "lucide-react";
import { analyzeProjectAiCrawlerAccess } from "@/serverFunctions/geo-crawlers";
import { getProjects } from "@/serverFunctions/projects";
import { getStandardErrorMessage } from "@/client/lib/error-messages";
import {
  canSubmitUrl,
  filterCrawlerRows,
  GEO_CRAWLER_FILTER_HINT,
  GEO_CRAWLER_FILTERS,
  GEO_CRAWLER_PAGE_BADGE,
  ruleLabel,
  sortCrawlerRows,
  statusBadgeVariant,
  statusLabel,
  summarizeGeoCrawlerReport,
  tierLabel,
  type GeoCrawlerFilterId,
} from "@/client/features/geo-crawlers/geoCrawlerView";
import type { AiCrawlerAccessReport } from "@/server/lib/geo/aiCrawlerAccess";
import { GeoSiblingNav } from "@/client/features/geo/GeoSiblingNav";
import { geoStatusAlertVariant } from "@/client/features/geo/geoStatusAlert";
import { Alert, AlertDescription, AlertTitle } from "@/client/ui/alert";
import { Badge } from "@/client/ui/badge";
import { Button } from "@/client/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/client/ui/card";
import { Input } from "@/client/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/ui/table";

type Props = {
  projectId: string;
};

export function GeoCrawlersPage({ projectId }: Props) {
  const urlFieldId = useId();
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
  });
  const project = projectsQuery.data?.find((row) => row.id === projectId);
  const defaultUrl = project?.domain ?? "";
  const [url, setUrl] = useState("");
  const [touched, setTouched] = useState(false);
  const [requestedUrl, setRequestedUrl] = useState<string | null>(null);
  const value = touched ? url : defaultUrl;

  useEffect(() => {
    if (requestedUrl !== null || touched || !defaultUrl) return;
    setRequestedUrl(defaultUrl);
  }, [defaultUrl, requestedUrl, touched]);

  const analysis = useQuery({
    queryKey: ["geo-crawlers", projectId, requestedUrl],
    enabled: Boolean(requestedUrl && canSubmitUrl(requestedUrl)),
    queryFn: () =>
      analyzeProjectAiCrawlerAccess({
        data: { projectId, url: requestedUrl || undefined },
      }),
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = value.trim();
    if (!canSubmitUrl(next) || analysis.isFetching) return;
    setRequestedUrl(next);
  }

  const report = analysis.data;
  const summary = report ? summarizeGeoCrawlerReport(report) : null;
  const submitDisabled = !canSubmitUrl(value) || analysis.isFetching;
  const liveMessage = analysis.isFetching
    ? "Checking crawler access."
    : analysis.isError
      ? getStandardErrorMessage(analysis.error)
      : summary?.headline;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 pb-safe sm:p-6">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground">
            AI crawler access
          </h1>
          <Badge variant="outline">{GEO_CRAWLER_PAGE_BADGE}</Badge>
        </div>
        <p className="max-w-2xl text-pretty text-sm text-muted-foreground">
          See which named AI search crawlers robots.txt allows or blocks. Uses
          no credits. Training-bot blocks are a preference, not a ranking
          defect. Squadbots can run the same check through MCP.
        </p>
        <GeoSiblingNav projectId={projectId} from="crawlers" />
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Check a site</CardTitle>
          <CardDescription>
            Defaults to this project&apos;s domain. Enter any public URL.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <label htmlFor={urlFieldId} className="text-sm font-medium">
                Site URL
              </label>
              <Input
                id={urlFieldId}
                name="url"
                inputMode="url"
                autoComplete="url"
                placeholder="example.com"
                value={value}
                onChange={(event) => {
                  setTouched(true);
                  setUrl(event.target.value);
                }}
                aria-invalid={analysis.isError || undefined}
                aria-describedby={
                  analysis.isError ? `${urlFieldId}-error` : undefined
                }
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={submitDisabled}
              aria-busy={analysis.isFetching}
              className="w-full sm:w-auto"
            >
              <ScanSearch aria-hidden="true" />
              {analysis.isFetching ? "Checking…" : "Check crawlers"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>

      {analysis.isError ? (
        <Alert variant={geoStatusAlertVariant("error")}>
          <AlertTitle id={`${urlFieldId}-error`}>
            Could not read crawler rules
          </AlertTitle>
          <AlertDescription>
            <p>{getStandardErrorMessage(analysis.error)}</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void analysis.refetch();
              }}
            >
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {analysis.isFetching && !report ? (
        <Card>
          <CardHeader>
            <CardTitle>Reading robots.txt</CardTitle>
            <CardDescription>
              Fetching public crawler rules. This does not use credits.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {!requestedUrl && !analysis.isFetching && !analysis.isError ? (
        <Alert variant={geoStatusAlertVariant("info")}>
          <AlertTitle>No domain on this project</AlertTitle>
          <AlertDescription>
            Enter a public URL to see ChatGPT Search, Claude, Perplexity,
            Googlebot, and training-bot access.
          </AlertDescription>
        </Alert>
      ) : null}

      {report && summary ? <GeoCrawlerResults report={report} /> : null}
    </div>
  );
}

function GeoCrawlerResults({ report }: { report: AiCrawlerAccessReport }) {
  const [filter, setFilter] = useState<GeoCrawlerFilterId>("all");
  const summary = summarizeGeoCrawlerReport(report);
  const rows = filterCrawlerRows(sortCrawlerRows(report.crawlers), filter);
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Search crawlers"
          value={`${summary.searchTotal - summary.blockedSearch}/${summary.searchTotal} allowed`}
          hint={summary.headline}
        />
        <SummaryCard
          title="Training preference"
          value={
            summary.blockedTraining === 0
              ? "No training blocks"
              : `${summary.blockedTraining} training bot${summary.blockedTraining === 1 ? "" : "s"} blocked`
          }
          hint="Does not change search-crawler access."
        />
        <SummaryCard
          title="Content map"
          value={summary.llmsLabel}
          hint={summary.robotsLabel}
        />
        <SummaryCard
          title="Page sample"
          value={summary.pageSampleLabel}
          hint={summary.pageSampleHint}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>JSON-LD on this page</CardTitle>
          <CardDescription>{summary.jsonLdHint}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-pretty text-sm text-foreground">
            {summary.jsonLdLabel}
          </p>
          {report.pageSample.jsonLd.types.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {report.pageSample.jsonLd.types.map((type) => (
                <Badge key={type} variant="secondary">
                  {type}
                </Badge>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Crawler map</CardTitle>
          <CardDescription>
            Specific rules beat wildcard. Missing robots.txt allows everyone.
            Checked {report.origin}.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <p className="text-pretty text-sm text-muted-foreground">
              {GEO_CRAWLER_FILTER_HINT}
            </p>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Crawler kind"
            >
              {GEO_CRAWLER_FILTERS.map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  size="sm"
                  variant={filter === item.id ? "default" : "outline"}
                  aria-pressed={filter === item.id}
                  onClick={() => setFilter(item.id)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          <Table>
            <TableCaption>
              Access map only. Not a ranking or citation prediction.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Crawler</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Kind</TableHead>
                <TableHead>Access</TableHead>
                <TableHead>Rule</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.userAgent}>
                  <TableCell className="font-medium">{row.userAgent}</TableCell>
                  <TableCell>{row.operator}</TableCell>
                  <TableCell>{tierLabel(row.tier)}</TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(row)}>
                      {statusLabel(row.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{ruleLabel(row.rule)}</TableCell>
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
