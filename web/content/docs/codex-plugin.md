---
title: "Install the SearchCrew plugin for Codex"
description: "Add SearchCrew MCP and Agent Skills to Codex with one marketplace and one install command."
---

> **Hosted beta status:** The plugin source can be inspected, but SearchCrew's hosted MCP login is not live yet. Treat the commands below as beta documentation until [launch status](/get-started) confirms production verification.

The SearchCrew plugin bundles SearchCrew MCP and all nine SEO Agent Skills into one install. This is the preferred way to set up SearchCrew in Codex CLI.

## Install

Run these commands in your terminal:

```bash
codex plugin marketplace add jaimedhenriques/open-seo
codex plugin add searchcrew@searchcrew
codex mcp login searchcrew
```

`codex mcp login` opens a browser to approve the SearchCrew connection. If it reports that `searchcrew` isn't found, restart Codex first — bundled MCP servers only register after a restart, not immediately after install — then run `codex mcp login searchcrew` again.

Once the hosted beta opens, Codex will connect to SearchCrew MCP and enable nine skills:

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

If the SearchCrew MCP server doesn't appear after restart, run `/mcp` in the Codex TUI to check its status, then run `codex mcp login searchcrew` again.

If it still doesn't authenticate, log out first and retry:

```bash
codex mcp logout searchcrew
codex mcp login searchcrew
```

If a `codex plugin` command reports "unrecognized subcommand," run `codex plugin --help` to see the subcommands your installed version actually supports — they've changed across versions (for example, `add`/`remove`, not `install`/`uninstall`).

## Other clients

This plugin is for Codex CLI. For Claude Code, use the [SearchCrew plugin for Claude Code](/docs/claude-code-plugin) instead. For Claude Desktop, Cursor, Codex Desktop, or an API key setup, see [Set up SearchCrew MCP](/docs/mcp) and [Set up SearchCrew Agent Skills](/docs/skills/setup).
