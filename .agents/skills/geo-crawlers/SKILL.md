---
name: geo-crawlers
description: AI crawler access analysis. Checks robots.txt, meta tags, and HTTP headers to determine which AI crawlers can access the site. Provides a complete access map and recommendations for maximizing AI visibility while maintaining appropriate control.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
  - WebFetch
  - Write
---

# AI Crawler Access Analysis Skill


## Project context

The project-context tools are free and shared with the app and other agents.

1. Call `get_project_context` first — what the business does decides which
   pages and questions matter for AI visibility.
2. On finish, append a research log entry:
   `{ appendResearchLog: { summary: "<what was checked>. Verdict: <conclusion>" } }`.

## Purpose

This skill analyzes a website's accessibility to named AI crawlers. Each bot has a different purpose: search indexing, user-directed retrieval, or model training. Access matters only to the product that uses that bot, so never treat a training crawler as a requirement for search visibility.

## Key Insight

Crawler names and purposes change. Verify the current vendor documentation before recommending a rule, distinguish search/retrieval from training, and explain the consequence for that specific product rather than promising a ranking or citation outcome.

---

## Complete AI Crawler Reference

### Tier 1: Critical for AI Search Visibility (RECOMMEND: ALLOW)

These crawlers power the AI search products where users actively look for answers. Blocking them directly reduces your visibility in AI-generated responses.

#### OAI-SearchBot
- **Operator:** OpenAI
- **User-Agent:** `OAI-SearchBot`
- **Full User-Agent String:** `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; OAI-SearchBot/1.0; +https://docs.openai.com/bots/overview)`
- **Purpose:** Specifically powers ChatGPT's search feature. Unlike GPTBot, content accessed by OAI-SearchBot is NOT used for model training -- only for live search results.
- **Impact of Blocking:** Content will not appear in ChatGPT's search results even if GPTBot is allowed.
- **Recommendation:** **ALLOW for ChatGPT Search visibility** -- This choice is independent of whether GPTBot is allowed for potential training.

#### ChatGPT-User
- **Operator:** OpenAI
- **User-Agent:** `ChatGPT-User`
- **Full User-Agent String:** `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ChatGPT-User/1.0; +https://openai.com/bot)`
- **Purpose:** Used when a ChatGPT user explicitly asks the model to visit a specific URL. Acts like a browser agent on behalf of the user.
- **Impact of Blocking:** ChatGPT cannot visit your pages when users ask it to read or summarize them. This prevents direct user-initiated traffic.
- **Recommendation:** **ALLOW** -- Blocking this bot prevents users who are actively trying to engage with your content from accessing it through ChatGPT.

#### Claude-SearchBot
- **Operator:** Anthropic
- **User-Agent:** `Claude-SearchBot`
- **Purpose:** Indexes content to improve Claude search result relevance and accuracy.
- **Impact of Blocking:** May reduce the site's visibility and accuracy in Claude search results.
- **Recommendation:** **ALLOW for Claude search visibility**.

#### Claude-User
- **Operator:** Anthropic
- **User-Agent:** `Claude-User`
- **Purpose:** Retrieves pages in response to user-directed requests.
- **Impact of Blocking:** Prevents Claude from retrieving the content for those user requests.
- **Recommendation:** **ALLOW for user-directed retrieval**.

#### PerplexityBot
- **Operator:** Perplexity AI
- **User-Agent:** `PerplexityBot`
- **Full User-Agent String:** `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)`
- **Purpose:** Powers Perplexity's AI search engine, which provides sourced answers with direct citations and links back to source pages.
- **Impact of Blocking:** Content will not appear in Perplexity search results. Perplexity is one of the best referral traffic sources among AI search products because it always displays source links.
- **Recommendation:** **ALLOW** -- Perplexity drives actual referral traffic and always attributes sources. High-value AI crawler for publishers and businesses.

#### Googlebot
- **Operator:** Google
- **User-Agent:** `Googlebot`
- **Purpose:** Crawls and indexes Google Search, including eligibility for supporting links in AI Overviews and AI Mode.
- **Impact of Blocking:** The page may not be indexed or eligible for Google Search AI features.
- **Recommendation:** **ALLOW for Google Search visibility**. Google documents no additional crawler or machine-readable file requirement for AI Overviews or AI Mode.

---

### Tier 2: Important for Broader AI Ecosystem (RECOMMEND: ALLOW)

These crawlers serve large AI platforms or search ecosystems. Allowing them increases your content's reach.

#### GoogleOther
- **Operator:** Google
- **User-Agent:** `GoogleOther`
- **Purpose:** Used by Google for various non-search-ranking purposes including research, one-off crawls, and AI-related data collection.
- **Impact of Blocking:** Minimal impact on search rankings. May reduce presence in Google's AI research and experimental features.
- **Recommendation:** **ALLOW** -- Low risk, moderate potential benefit for AI feature inclusion.

#### Applebot-Extended
- **Operator:** Apple
- **User-Agent:** `Applebot-Extended`
- **Purpose:** Used by Apple to train and improve Apple Intelligence features, Siri, and Apple's AI products. Separate from standard Applebot (which powers Siri search and Spotlight Suggestions).
- **Impact of Blocking:** Content may not be used in Apple Intelligence features. Standard Siri and Spotlight functionality is unaffected (controlled by Applebot).
- **Recommendation:** **ALLOW** -- Apple Intelligence is integrated into all Apple devices (2B+ active devices). Presence in Apple's AI features has growing strategic value.

#### Amazonbot
- **Operator:** Amazon
- **User-Agent:** `Amazonbot`
- **Full User-Agent String:** `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/600.2.5 (KHTML, like Gecko) Version/8.0.2 Safari/600.2.5 (compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot)`
- **Purpose:** Indexes content for Alexa answers and Amazon's AI features.
- **Impact of Blocking:** Content will not appear in Alexa voice responses or Amazon's AI-powered search features.
- **Recommendation:** **ALLOW** -- Relevant for voice search optimization. Lower priority than Tier 1 crawlers but no downside to allowing.

#### FacebookBot
- **Operator:** Meta
- **User-Agent:** `FacebookBot`
- **Purpose:** Used by Meta for AI features across Facebook, Instagram, WhatsApp, and Meta AI assistant.
- **Impact of Blocking:** Content may not be accessible to Meta AI. Link previews on Facebook/Instagram are handled by a different crawler and are unaffected.
- **Recommendation:** **ALLOW** -- Meta AI is embedded in apps with 3B+ combined users. Growing importance for AI visibility.

---

### Tier 3: Training and non-Search controls (ALLOW or BLOCK Based on Strategy)

These controls are independent of the named search crawlers above. Decide based on training and product-grounding preferences, not search visibility.

#### GPTBot
- **Operator:** OpenAI
- **User-Agent:** `GPTBot`
- **Purpose:** Crawls content that may be used to improve or train OpenAI models.
- **Impact of Blocking:** Signals that the content should be excluded from potential training. It does not exclude the site from ChatGPT Search when OAI-SearchBot is allowed.
- **Recommendation:** **CONTEXT-DEPENDENT** -- follow the site's training-data preference.

#### ClaudeBot
- **Operator:** Anthropic
- **User-Agent:** `ClaudeBot`
- **Purpose:** Collects content that may contribute to Anthropic model training.
- **Impact of Blocking:** Signals that future site material should be excluded from Anthropic training datasets. Claude search and user retrieval have separate bots.
- **Recommendation:** **CONTEXT-DEPENDENT** -- follow the site's training-data preference.

#### Google-Extended
- **Operator:** Google
- **User-Agent token:** `Google-Extended`
- **Purpose:** A standalone product token controlling some Gemini training and grounding uses; it is not a Google Search crawler.
- **Impact of Blocking:** Does not affect Google Search ranking or eligibility for AI Overviews and AI Mode, which use Googlebot and normal Search eligibility.
- **Recommendation:** **CONTEXT-DEPENDENT** -- follow the site's training and grounding preference.

#### CCBot
- **Operator:** Common Crawl (nonprofit)
- **User-Agent:** `CCBot`
- **Full User-Agent String:** `CCBot/2.0 (https://commoncrawl.org/faq/)`
- **Purpose:** Builds the Common Crawl dataset, which is used as training data by many AI companies (Google, Meta, Stability AI, and others).
- **Impact of Blocking:** Content will not appear in future Common Crawl datasets. Does NOT affect any live AI search product.
- **Recommendation:** **CONTEXT-DEPENDENT** -- Allow if you want maximum long-term AI training presence. Block if you want to control training data usage. No impact on search visibility.

#### Bytespider
- **Operator:** ByteDance
- **User-Agent:** `Bytespider`
- **Purpose:** Used by ByteDance for various AI products including TikTok's AI features and Doubao (their ChatGPT competitor in China).
- **Impact of Blocking:** Content will not be used for ByteDance AI products. Minimal impact for Western-market businesses.
- **Recommendation:** **BLOCK** for most Western businesses (aggressive crawling behavior reported, minimal search visibility benefit). **ALLOW** if targeting Chinese/Asian markets.

#### cohere-ai
- **Operator:** Cohere
- **User-Agent:** `cohere-ai`
- **Purpose:** Used by Cohere for model training. Cohere powers enterprise AI solutions and the Coral chat product.
- **Impact of Blocking:** Content will not be used for Cohere model training. Minimal direct consumer-facing impact.
- **Recommendation:** **CONTEXT-DEPENDENT** -- Low priority. Allow or block based on general training data stance.

---

## Recommendation Matrix Summary

| Crawler | Tier | Recommendation | Reason |
|---|---|---|---|
| OAI-SearchBot | 1 | **ALLOW** | Search-only, no training use |
| ChatGPT-User | 1 | **ALLOW** | User-initiated browsing |
| Claude-SearchBot | 1 | **ALLOW** | Claude search indexing |
| Claude-User | 1 | **ALLOW** | User-directed retrieval |
| PerplexityBot | 1 | **ALLOW** | Best referral traffic AI search |
| Googlebot | 1 | **ALLOW** | Google Search, AI Overviews, and AI Mode |
| GoogleOther | 2 | **ALLOW** | Google AI research |
| Applebot-Extended | 2 | **ALLOW** | Apple Intelligence (2B+ devices) |
| Amazonbot | 2 | **ALLOW** | Alexa and Amazon AI |
| FacebookBot | 2 | **ALLOW** | Meta AI (3B+ app users) |
| GPTBot | 3 | Context | OpenAI training control |
| ClaudeBot | 3 | Context | Anthropic training control |
| Google-Extended | 3 | Context | Gemini training/grounding control; not Search |
| CCBot | 3 | Context | Training data only |
| Bytespider | 3 | **BLOCK** | Aggressive crawler, low benefit |
| cohere-ai | 3 | Context | Training data only |

### Maximum AI Visibility Configuration (robots.txt)

For sites wanting maximum AI search visibility:

```
# Search and user-retrieval crawlers
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Googlebot
Allow: /

User-agent: GoogleOther
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: FacebookBot
Allow: /

# Training/grounding controls: choose based on the site's policy
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

# AI Crawlers - BLOCKED (aggressive/low value)
User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /
```

---

## Analysis Procedure

### Step 1: Fetch and Parse robots.txt

1. Use WebFetch to retrieve `[domain]/robots.txt`.
2. Parse all User-agent directives and their associated Allow/Disallow rules.
3. For each AI crawler in the reference list above:
   - Check if there is a specific User-agent block for that crawler
   - Check if there is a wildcard (`User-agent: *`) block that would apply
   - Determine effective access: **Allowed**, **Blocked**, or **Not Mentioned** (inherits wildcard rules)
4. Note any `Crawl-delay` directives that may slow AI crawler access.
5. Check for `Sitemap` directives (AI crawlers use these for discovery).

### Step 2: Check Meta Robots Tags

1. For a sample of 5-10 key pages, fetch the HTML and check for:
   - `<meta name="robots" content="noindex">` -- blocks all bots
   - `<meta name="robots" content="nofollow">` -- prevents link following
   - `<meta name="robots" content="noai">` -- emerging tag to block AI use
   - `<meta name="robots" content="noimageai">` -- blocks AI image training
   - Bot-specific meta tags: `<meta name="GPTBot" content="noindex">`
2. Record any page-level overrides of the robots.txt directives.

### Step 3: Check HTTP Headers

1. For the same sample pages, check response headers for:
   - `X-Robots-Tag: noindex` -- HTTP header equivalent of meta noindex
   - `X-Robots-Tag: noai` -- HTTP header to block AI use
   - `X-Robots-Tag: noimageai` -- blocks AI image training
   - Bot-specific headers: `X-Robots-Tag: GPTBot: noindex`
2. Note that HTTP headers override meta tags and apply to non-HTML resources too.

### Step 4: Check for AI-Specific Files

1. Check for `/llms.txt` (optional proposed content map; not a crawler-control file).
2. Check for `/.well-known/ai-plugin.json` (OpenAI plugin manifest).
3. Check for `/ai.txt` (proposed standard, similar to ads.txt for AI).
4. Record presence/absence and quality of each file.

### Step 5: Assess JavaScript Rendering Requirements

1. Check if the site is a Single Page Application (SPA) or heavily JavaScript-rendered.
2. Do not assume rendering support from the bot name. Fetch representative pages as the relevant crawler where possible and verify that critical content is present in the returned HTML.
3. If critical content requires client-side rendering and cannot be fetched by the relevant crawler, flag this as a potential issue.
4. Check for Server-Side Rendering (SSR) or Static Site Generation (SSG) as mitigations.

### Step 6: Parse Content Signals

Using the already-fetched robots.txt from Step 1, scan for `Content-Signal:` directives (IETF draft `draft-romm-aipref-contentsignals`).

1. Scan every line for a line starting with `Content-Signal:` (case-insensitive).
2. If found:
   - Parse all key=value pairs (split on `,` then on `=`).
   - Validate keys against the known set: `ai-train`, `search`, `ai-personalization`, `ai-retrieval`.
   - Validate values: only `yes` and `no` are valid.
   - Flag any unknown keys or invalid values as a warning — the spec is still an IETF draft.
   - Record the result as **Pass** and surface parsed values with plain-English meaning.
3. If absent: record as **Recommendation** — the site has not declared AI usage preferences.

No additional HTTP request is needed. robots.txt is already fetched in Step 1.

---

## Output Format

Generate a file called `GEO-CRAWLER-ACCESS.md`:

```markdown
# AI Crawler Access Report: [Domain]

**Analysis Date:** [Date]
**Domain:** [Domain]
**robots.txt Status:** [Found/Not Found/Error]

---

## Crawler Access Summary

| Crawler | Operator | Tier | Status | Impact |
|---|---|---|---|---|
| OAI-SearchBot | OpenAI | 1 | [Status] | [Impact] |
| ChatGPT-User | OpenAI | 1 | [Status] | [Impact] |
| Claude-SearchBot | Anthropic | 1 | [Status] | [Impact] |
| Claude-User | Anthropic | 1 | [Status] | [Impact] |
| PerplexityBot | Perplexity | 1 | [Status] | [Impact] |
| Googlebot | Google | 1 | [Status] | [Impact] |
| GoogleOther | Google | 2 | [Status] | [Impact] |
| Applebot-Extended | Apple | 2 | [Status] | [Impact] |
| Amazonbot | Amazon | 2 | [Status] | [Impact] |
| FacebookBot | Meta | 2 | [Status] | [Impact] |
| GPTBot | OpenAI | 3 | [Status] | [Training preference impact] |
| ClaudeBot | Anthropic | 3 | [Status] | [Training preference impact] |
| Google-Extended | Google | 3 | [Status] | [Training/grounding preference impact] |
| CCBot | Common Crawl | 3 | [Status] | [Impact] |
| Bytespider | ByteDance | 3 | [Status] | [Impact] |
| cohere-ai | Cohere | 3 | [Status] | [Impact] |

## AI Visibility Score: [X]/100

**Tier 1 Access:** [X/6 crawlers allowed]
**Tier 2 Access:** [X/4 crawlers allowed]
**Tier 3 Preferences:** [Summarize the site's declared training/grounding choices; do not score them as visibility defects]

---

## Critical Issues

[List any Tier 1 crawlers that are blocked]

## Recommendations

### Immediate Actions
[Specific robots.txt changes needed]

### robots.txt Recommendation
```
[Complete recommended robots.txt content for AI crawlers]
```

### Additional Technical Findings
- **Meta Robots Tags:** [Findings]
- **X-Robots-Tag Headers:** [Findings]
- **JavaScript Rendering:** [Assessment]
- **llms.txt:** [Present/Absent]
- **Sitemap Accessibility:** [Assessment]

### Content Signals (IETF Draft)

**Status:** Present / Absent

<!-- If present: -->
| Signal Key | Value | Meaning |
|---|---|---|
| ai-train | no | Opted out of AI model training |
| search | yes | Permits use in AI-powered search results |

<!-- If absent: -->
**Recommendation:** Add a `Content-Signal:` directive to robots.txt to declare AI usage preferences explicitly. Example:

`Content-Signal: ai-train=no, search=yes, ai-retrieval=yes`

See https://contentsignals.org/ for the full specification.
```

---

## Scoring for Crawler Access

The AI Crawler Access Score is calculated as:

| Component | Weight | Scoring |
|---|---|---|
| Tier 1 Crawlers Allowed | 60% | Equal credit for each of the 6 search/retrieval crawlers |
| Tier 2 Crawlers Allowed | 25% | Equal credit for each of the 4 broader-ecosystem crawlers |
| No Blanket AI Blocks | 15% | Full points if no `User-agent: *` Disallow: / and no noai meta tags |

This is a heuristic access score, not a prediction of ranking or citation. Training/grounding choices and `llms.txt` presence do not add or subtract points.

---

## Origin and licence

Vendored from [zubair-trabzada/geo-seo-claude](https://github.com/zubair-trabzada/geo-seo-claude),
MIT licensed, Copyright (c) 2026 Zubair Trabzada. The upstream licence is kept
alongside this file in `LICENSE`. Re-vendor from upstream rather than editing
this file in place, so the two do not silently diverge.
