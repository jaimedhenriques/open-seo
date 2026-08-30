---
title: "Install the SearchCrew plugin for Claude Code"
description: "Add SearchCrew MCP and Agent Skills to Claude Code with one marketplace and one install command."
---

> **Hosted beta status:** The plugin source can be inspected, but SearchCrew's hosted MCP login is not live yet. Treat the commands below as beta documentation until [launch status](/get-started) confirms production verification.

The SearchCrew plugin bundles SearchCrew MCP and all nine SEO Agent Skills into one install. This is the preferred way to set up SearchCrew in Claude Code.

## Install

Run these two commands in Claude Code:

```bash
/plugin marketplace add jaimedhenriques/open-seo
/plugin install searchcrew@searchcrew
```

If the install summary says `Run /reload-plugins to activate.`, run that command.

Once the hosted beta opens, Claude Code will connect to SearchCrew MCP and enable nine skills:

- SEO Project Setup
- SEO Coach
- SEO Audit
- Keyword Research
- Keyword Clustering
- Competitive Landscape
- Competitor Analysis
- Local SEO
- Link Prospecting

## Finish the login

Claude Code should prompt you to log in to SearchCrew right after install. If it doesn't, run `/mcp` and approve the SearchCrew connection from there.

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

Claude Desktop doesn't support this plugin format — plugins are a Claude Code feature. For Claude Desktop, [add SearchCrew as an MCP connector](/docs/mcp#claude-desktop) instead.

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

If the SearchCrew connection doesn't show as authenticated, run `/mcp`, select SearchCrew, and complete the login.

## Other clients

This plugin is for Claude Code. For Codex CLI, use the [SearchCrew plugin for Codex](/docs/codex-plugin) instead. For Cursor, Codex Desktop, Claude Desktop, or an API key setup, see [Set up SearchCrew MCP](/docs/mcp) and [Set up SearchCrew Agent Skills](/docs/skills/setup).
