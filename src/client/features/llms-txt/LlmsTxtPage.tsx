import { useEffect, useId, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { analyzeProjectLlmsTxt } from "@/serverFunctions/llms-txt";
import { getProjects } from "@/serverFunctions/projects";
import { getStandardErrorMessage } from "@/client/lib/error-messages";
import {
  canSubmitUrl,
  checkBadgeVariant,
  summarizeLlmsTxt,
} from "@/client/features/llms-txt/llmsTxtView";
import type { LlmsTxtReport } from "@/server/lib/geo/llmsTxt";
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

export function LlmsTxtPage({ projectId }: Props) {
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
    queryKey: ["llms-txt", projectId, requestedUrl],
    enabled: Boolean(requestedUrl && canSubmitUrl(requestedUrl)),
    queryFn: () =>
      analyzeProjectLlmsTxt({
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
  const summary = report ? summarizeLlmsTxt(report) : null;
  const submitDisabled = !canSubmitUrl(value) || analysis.isFetching;
  const liveMessage = analysis.isFetching
    ? "Checking llms.txt."
    : analysis.isError
      ? getStandardErrorMessage(analysis.error)
      : summary?.headline;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 pb-safe sm:p-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground">
          llms.txt map
        </h1>
        <p className="max-w-2xl text-pretty text-sm text-muted-foreground">
          Read the proposed /llms.txt content map. Uses no credits. This file is
          optional. Absence is not a ranking defect, and a published file is not
          a ranking or citation lever.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Check a site</CardTitle>
          <CardDescription>
            Defaults to this project&apos;s domain. Fetches only /llms.txt.
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
              <FileText aria-hidden="true" />
              {analysis.isFetching ? "Checking…" : "Check llms.txt"}
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
            Could not read llms.txt
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
            <CardTitle>Reading llms.txt</CardTitle>
            <CardDescription>
              Fetching the public content map. This does not use credits.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {!requestedUrl && !analysis.isFetching && !analysis.isError ? (
        <Alert variant={geoStatusAlertVariant("info")}>
          <AlertTitle>No domain on this project</AlertTitle>
          <AlertDescription>
            Enter a public URL to check /llms.txt.
          </AlertDescription>
        </Alert>
      ) : null}

      {report && summary ? (
        <LlmsTxtResults report={report} summary={summary} />
      ) : null}
    </div>
  );
}

function LlmsTxtResults({
  report,
  summary,
}: {
  report: LlmsTxtReport;
  summary: ReturnType<typeof summarizeLlmsTxt>;
}) {
  const entries = report.sections.flatMap((section) =>
    section.entries.map((entry) => ({ ...entry, heading: section.heading })),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="gap-3 py-4">
          <CardHeader className="px-4">
            <CardDescription>File</CardDescription>
            <CardTitle className="text-base">{summary.statusLabel}</CardTitle>
            <p className="text-pretty text-xs text-muted-foreground">
              {summary.headline}
            </p>
          </CardHeader>
        </Card>
        <Card className="gap-3 py-4">
          <CardHeader className="px-4">
            <CardDescription>Pages listed</CardDescription>
            <CardTitle className="text-base tabular-nums">
              {summary.pageCount}
            </CardTitle>
            <p className="text-pretty text-xs text-muted-foreground">
              {report.title ?? "No H1 title"}
            </p>
          </CardHeader>
        </Card>
        <Card className="gap-3 py-4">
          <CardHeader className="px-4">
            <CardDescription>Format checks</CardDescription>
            <CardTitle className="text-base tabular-nums">
              {summary.passCount} pass / {summary.failCount} fail
            </CardTitle>
            <p className="text-pretty text-xs text-muted-foreground">
              Format only. Not a ranking score.
            </p>
          </CardHeader>
        </Card>
      </div>

      {report.checks.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Format</CardTitle>
            <CardDescription>
              Checked {report.url}. Relative links fail; missing file is not a
              fail here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                Optional content map. Not a ranking or citation prediction.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Check</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.checks.map((check) => (
                  <TableRow key={check.id}>
                    <TableCell className="font-medium">{check.label}</TableCell>
                    <TableCell>
                      <Badge variant={checkBadgeVariant(check.status)}>
                        {check.status === "pass" ? "Pass" : "Fail"}
                      </Badge>
                    </TableCell>
                    <TableCell>{check.detail}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}

      {entries.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Listed pages</CardTitle>
            <CardDescription>
              {report.description ?? "No blockquote description."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Section</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>URL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={`${entry.heading}-${entry.url}`}>
                    <TableCell>{entry.heading}</TableCell>
                    <TableCell className="font-medium">{entry.title}</TableCell>
                    <TableCell className="break-all">{entry.url}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
