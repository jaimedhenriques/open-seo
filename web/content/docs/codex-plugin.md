---
title: "Install SearchCrew skills for Codex"
description: "Add nine SearchCrew Agent Skills to Codex from the SearchCrew marketplace."
---

> **Current package:** The plugin installs nine SEO Agent Skills. It does not register the paused hosted MCP endpoint. Check [launch status](/get-started) before trying the separate MCP setup.

The SearchCrew plugin installs all nine SEO workflow skills in one step.

## Install

Run these commands in your terminal:

```bash
codex plugin marketplace add jaimedhenriques/searchcrew
codex plugin add searchcrew@searchcrew
```

After restart, Codex enables nine skills:

- SEO Project Setup
- SEO Coach
- SEO Audit
- Keyword Research
- Keyword Clustering
- Competitive Landscape
- Competitor Analysis
- Local SEO
- Link Prospecting

## Run a skill

Type `$` in Codex to see available skills, or ask Codex to run one by name, for example "run seo-project-setup" or "run seo-audit on example.com".

## Update or remove

```bash
codex plugin marketplace upgrade searchcrew
codex plugin remove searchcrew@searchcrew
```

## Troubleshooting

If a `codex plugin` command reports "unrecognized subcommand," run `codex plugin --help` to see the subcommands your installed version actually supports — they've changed across versions (for example, `add`/`remove`, not `install`/`uninstall`).

## Other clients

This plugin is for Codex CLI. For Claude Code, use the [SearchCrew plugin for Claude Code](/docs/claude-code-plugin). For other agents, see [Set up SearchCrew Agent Skills](/docs/skills/setup). Hosted MCP setup remains a separate, paused step.
