import { AppError } from "@/server/lib/errors";
import {
  isCrawlableUrl,
  normalizeAndValidateStartUrl,
} from "@/server/lib/audit/url-policy";
import {
  evaluateAiCrawlerAccess,
  type AiCrawlerAccessReport,
  type LlmsTxtFetchStatus,
  type RobotsTxtFetchStatus,
} from "@/server/lib/geo/aiCrawlerAccess";

const FETCH_TIMEOUT_MS = 10_000;
const MAX_ROBOTS_TXT_BYTES = 500 * 1024;
const MAX_REDIRECTS = 3;
const USER_AGENT = "SearchCrew-GEO/1.0";

async function fetchSameOrigin(
  url: string,
  origin: string,
): Promise<{ status: number; body: string | null }> {
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
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return { status: response.status, body: null };
      const next = new URL(location, current);
      if (next.origin !== origin) {
        return { status: response.status, body: null };
      }
      current = next.toString();
      continue;
    }
    if (!response.ok) return { status: response.status, body: null };
    const body = (await response.text()).slice(0, MAX_ROBOTS_TXT_BYTES);
    return { status: response.status, body };
  }
  return { status: 0, body: null };
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

  const parsed = evaluateAiCrawlerAccess(
    robotsStatus(robotsHttp, robotsBody) === "found" ? robotsBody : null,
  );

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
    ...parsed,
  };
}
