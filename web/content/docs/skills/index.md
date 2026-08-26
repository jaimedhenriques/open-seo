---
title: "SearchCrew Agent Skills"
description: "Add SearchCrew Agent Skills to Claude Code, Codex, or another AI agent so it can run repeatable SEO workflows with live SearchCrew data."
---

SearchCrew Agent Skills let you hand repeatable SEO workflows to your AI agent.

Run a slash command when you need keyword research, clustering, competitor analysis, link prospecting, or project setup. The skill gives your agent the workflow instructions.

You stay in charge of strategy. Your agent uses SearchCrew data and the skill instructions to return a recommendation, plan, or shortlist.

## Set up SearchCrew Agent Skills

On Claude Code, the [SearchCrew plugin](/docs/claude-code-plugin) installs MCP and every skill below in one step. On Codex CLI, the [SearchCrew plugin](/docs/codex-plugin) does the same. Use the manual steps here for other agents, or if you want to pick individual skills.

1. [Set up SearchCrew MCP](/docs/mcp).
2. [Set up SearchCrew Agent Skills](/docs/skills/setup).

MCP connects your agent to SearchCrew data. Skills tell your agent which SEO workflow to run.

## Start here

- [SEO Project Setup](/docs/skills/seo-project-setup): save your goals, positioning, competitors, and key pages to your project context, so every other skill reuses them.
- [SEO Coach](/docs/skills/seo-coach): choose the next workflow when you are new to SEO or unsure what to run first.

## Audit workflows

- [SEO Audit](/docs/skills/seo-audit): audit a site and get a one-page, plain-language report built around a single next action.

## AI visibility workflows

- [AI Crawler Access](/docs/skills/geo-crawlers): map which AI crawlers can reach your site and fix the blocks costing you visibility.
- [AI Citability](/docs/skills/geo-citability): score how likely assistants are to quote a page, and get the rewrites that raise it.
- [llms.txt](/docs/skills/geo-llmstxt): validate or generate the optional proposed content-map format.

## Research workflows

- [Keyword Research](/docs/skills/keyword-research): find keywords worth targeting and explain why they fit.
- [Keyword Clustering](/docs/skills/keyword-clustering): turn keyword lists into page groups, content priorities, and cannibalization checks.
- [Competitive Landscape](/docs/skills/competitive-landscape): map who is winning across a market and where your openings are.
- [Competitor Analysis](/docs/skills/competitor-analysis): analyze one competitor and turn the research into strategic takeaways.
- [Local SEO](/docs/skills/local-seo): audit a Google Business Profile, compare it to local competitors, and map Maps visibility around a location.

## Promotion workflows

- [Link Prospecting](/docs/skills/link-prospecting): find qualified outreach prospects and the angle that makes each one relevant.

## Learn more about skills

SearchCrew uses the same `SKILL.md` pattern supported by modern AI agents. To learn how skills work in your agent, read:

- [Claude Code skills documentation](https://docs.claude.com/en/docs/claude-code/skills)
- [OpenAI Skills documentation](https://help.openai.com/en/articles/20001066-skills-in-chatgpt)

## Read the actual skills

These pages explain what each skill is for. The source instructions live in GitHub:

- [SearchCrew Agent Skills on GitHub](https://github.com/every-app/open-seo/tree/main/.agents/skills)
