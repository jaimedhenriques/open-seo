import { AppError } from "@/server/lib/errors";
import {
  isCrawlableUrl,
  normalizeAndValidateStartUrl,
} from "@/server/lib/audit/url-policy";
import {
  evaluateAiCrawlerAccess,
  extractRobotsMeta,
  parsePageRobotTokens,
  type AiCrawlerAccessReport,
  type LlmsTxtFetchStatus,
  type PageRobotSample,
  type RobotsTxtFetchStatus,
} from "@/server/lib/geo/aiCrawlerAccess";
import { parseLlmsTxt, type LlmsTxtReport } from "@/server/lib/geo/llmsTxt";

const FETCH_TIMEOUT_MS = 10_000;
const MAX_ROBOTS_TXT_BYTES = 500 * 1024;
const MAX_PAGE_BYTES = 100 * 1024;
const MAX_REDIRECTS = 3;
const USER_AGENT = "SearchCrew-GEO/1.0";

async function fetchSameOrigin(
  url: string,
  origin: string,
  maxBytes = MAX_ROBOTS_TXT_BYTES,
): Promise<{
  status: number;
  body: string | null;
  xRobotsTag: string | null;
}> {
  let current = url;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (!isCrawlableUrl(current)) {
      throw new AppError("CRAWL_TARGET_BLOCKED");
    }
    const response = await fetch(current, {
      method: "GET",
      redirect: "manual",
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    const xRobotsTag = response.headers.get("x-robots-tag");
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) {
        return { status: response.status, body: null, xRobotsTag };
      }
      const next = new URL(location, current);
      if (next.origin !== origin) {
        return { status: response.status, body: null, xRobotsTag };
      }
      current = next.toString();
      continue;
    }
    if (!response.ok) {
      return { status: response.status, body: null, xRobotsTag };
    }
    const body = (await response.text()).slice(0, maxBytes);
    return { status: response.status, body, xRobotsTag };
  }
  return { status: 0, body: null, xRobotsTag: null };
}

function pageSampleStatus(
  httpStatus: number | null,
  body: string | null,
): PageRobotSample["status"] {
  if (httpStatus === 200 && body != null) return "found";
  if (httpStatus === 404) return "missing";
  return "error";
}

function robotsStatus(
  httpStatus: number | null,
  body: string | null,
): RobotsTxtFetchStatus {
  if (httpStatus === 200 && body != null) return "found";
  if (httpStatus === 404) return "missing";
  return "error";
}

function llmsStatus(httpStatus: number | null): LlmsTxtFetchStatus {
  if (httpStatus === 200) return "found";
  if (httpStatus === 404) return "missing";
  return "error";
}

export async function fetchAiCrawlerAccess(
  input: string,
): Promise<AiCrawlerAccessReport> {
  const startUrl = await normalizeAndValidateStartUrl(input);
  const origin = new URL(startUrl).origin;
  const robotsUrl = `${origin}/robots.txt`;
  const llmsUrl = `${origin}/llms.txt`;

  let robotsHttp: number | null = null;
  let robotsBody: string | null = null;
  let llmsHttp: number | null = null;
  let pageHttp: number | null = null;
  let pageBody: string | null = null;
  let xRobotsTag: string | null = null;

  try {
    const robots = await fetchSameOrigin(robotsUrl, origin);
    robotsHttp = robots.status || null;
    robotsBody = robots.body;
  } catch (error) {
    if (error instanceof AppError) throw error;
    robotsHttp = null;
    robotsBody = null;
  }

  try {
    const llms = await fetchSameOrigin(llmsUrl, origin);
    llmsHttp = llms.status || null;
  } catch (error) {
    if (error instanceof AppError) throw error;
    llmsHttp = null;
  }

  try {
    const page = await fetchSameOrigin(startUrl, origin, MAX_PAGE_BYTES);
    pageHttp = page.status || null;
    pageBody = page.body;
    xRobotsTag = page.xRobotsTag;
  } catch (error) {
    if (error instanceof AppError) throw error;
    pageHttp = null;
    pageBody = null;
    xRobotsTag = null;
  }

  const parsed = evaluateAiCrawlerAccess(
    robotsStatus(robotsHttp, robotsBody) === "found" ? robotsBody : null,
  );
  const robotsMeta =
    pageSampleStatus(pageHttp, pageBody) === "found" && pageBody
      ? extractRobotsMeta(pageBody)
      : null;

  return {
    origin,
    robotsTxt: {
      url: robotsUrl,
      status: robotsStatus(robotsHttp, robotsBody),
      httpStatus: robotsHttp,
    },
    llmsTxt: {
      url: llmsUrl,
      status: llmsStatus(llmsHttp),
      httpStatus: llmsHttp,
    },
    pageSample: {
      url: startUrl,
      status: pageSampleStatus(pageHttp, pageBody),
      httpStatus: pageHttp,
      robotsMeta,
      xRobotsTag,
      tokens: parsePageRobotTokens(robotsMeta, xRobotsTag),
    },
    ...parsed,
  };
}

export async function fetchLlmsTxt(input: string): Promise<LlmsTxtReport> {
  const startUrl = await normalizeAndValidateStartUrl(input);
  const origin = new URL(startUrl).origin;
  const url = `${origin}/llms.txt`;

  let httpStatus: number | null = null;
  let body: string | null = null;
  try {
    const result = await fetchSameOrigin(url, origin, MAX_PAGE_BYTES);
    httpStatus = result.status || null;
    body = result.body;
  } catch (error) {
    if (error instanceof AppError) throw error;
    httpStatus = null;
    body = null;
  }

  const fetchStatus = llmsStatus(httpStatus);
  const parsed =
    fetchStatus === "found" && body != null
      ? parseLlmsTxt(body)
      : parseLlmsTxt("");

  return {
    origin,
    url,
    fetchStatus,
    httpStatus,
    title: fetchStatus === "found" ? parsed.title : null,
    description: fetchStatus === "found" ? parsed.description : null,
    sections: fetchStatus === "found" ? parsed.sections : [],
    checks: fetchStatus === "found" ? parsed.checks : [],
  };
}
