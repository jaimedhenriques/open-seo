---
title: "Install SearchCrew skills for Claude Code"
description: "Add nine SearchCrew Agent Skills to Claude Code from the SearchCrew marketplace."
---

> **Current package:** The plugin installs nine SEO Agent Skills. It does not register the paused hosted MCP endpoint. Check [launch status](/get-started) before trying the separate MCP setup.

The SearchCrew plugin installs all nine SEO workflow skills in one step.

## Install

Run these two commands in Claude Code:

```bash
/plugin marketplace add jaimedhenriques/open-seo
/plugin install searchcrew@searchcrew
```

If the install summary says `Run /reload-plugins to activate.`, run that command.

After reload, Claude Code enables nine skills:

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

Plugin skills are namespaced by the plugin name:

```
/searchcrew:seo-project-setup
/searchcrew:seo-coach
/searchcrew:seo-audit
/searchcrew:keyword-research
/searchcrew:keyword-clustering
/searchcrew:competitive-landscape
/searchcrew:competitor-analysis
/searchcrew:local-seo
/searchcrew:link-prospecting
```

## Claude Desktop

Claude Desktop doesn't support this plugin format. When the hosted MCP endpoint is live, use the separate [MCP setup](/docs/mcp#claude-desktop).

## Update or remove

```bash
/plugin marketplace update searchcrew
/plugin uninstall searchcrew@searchcrew
```

Updates land in the cache immediately, but the running session keeps the old version until you run `/reload-plugins` or restart Claude Code.

## Troubleshooting

To check what's actually installed, run `/plugin list` rather than bare `/plugin` — `/plugin` alone opens an interactive panel that doesn't show plain text.

If `/reload-plugins` reports `0 skills`, that's normal, not a failure — its summary only counts a plugin's `commands/` directory, not `skills/`. Confirm the skills loaded by running one directly, for example `/searchcrew:seo-audit`.

If `/plugin uninstall searchcrew@searchcrew` reports "not installed in this project," you likely installed to a different scope than the one being checked (User, Project, or Local). Run `/plugin list` to see the actual scope, or sidestep the picker entirely with the shell form: `claude plugin uninstall searchcrew@searchcrew --scope user`.

If plugin skills don't appear, clear the plugin cache with `rm -rf ~/.claude/plugins/cache` — this clears every installed plugin's cache, not just SearchCrew's, so reinstall anything else you have after — then restart Claude Code and reinstall the plugin.

## Other clients

This plugin is for Claude Code. For Codex CLI, use the [SearchCrew plugin for Codex](/docs/codex-plugin). For other agents, see [Set up SearchCrew Agent Skills](/docs/skills/setup). Hosted MCP setup remains a separate, paused step.
