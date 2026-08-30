---
title: "Set up SearchCrew Agent Skills"
description: "Add SearchCrew workflow skill files to your AI agent."
---

SearchCrew Agent Skills are workflow files. They are separate from the hosted SearchCrew MCP connection, which is currently paused.

On Claude Code, use the [SearchCrew plugin](/docs/claude-code-plugin) to install all nine packaged skills. On Codex CLI, use the [SearchCrew plugin](/docs/codex-plugin).

You can install and inspect the skills now. Workflows that need live SearchCrew data will require the separate [hosted MCP setup](/docs/mcp) after launch status confirms it is available.

## Choose an installation option

Pick the option that matches how you want to install the files.

### Option 1: Install and choose interactively

Use this if you want the installer to show the available skills and agents.

```bash
npx skills add jaimedhenriques/open-seo
```

### Option 2: Install all SearchCrew skills

Use this if you want every SearchCrew skill.

```bash
npx skills add jaimedhenriques/open-seo --skill '*'
```

### Option 3: Install all skills for Claude Code only

Use this if the skills should be available in Claude Code only.

```bash
npx skills add jaimedhenriques/open-seo --skill '*' --agent claude-code
```

### Option 4: Install all skills for OpenAI Codex only

Use this if the skills should be available in Codex only.

```bash
npx skills add jaimedhenriques/open-seo --skill '*' --agent codex
```

### Option 5: Copy the skill files manually

Use this if you prefer to copy files into your agent's skills folder.

```bash
git clone https://github.com/jaimedhenriques/open-seo.git

# Codex
mkdir -p ~/.codex/skills
cp -R open-seo/.agents/skills/* ~/.codex/skills/

# Claude Code
mkdir -p ~/.claude/skills
cp -R open-seo/.agents/skills/* ~/.claude/skills/
```

You can also review the source skills on GitHub:

- [SearchCrew Agent Skills on GitHub](https://github.com/jaimedhenriques/open-seo/tree/main/.agents/skills)

Each skill page also links to its source `SKILL.md`.

## Run a skill

After the skill files are available to your agent, run the matching slash command:

- `/seo-project-setup`
- `/seo-coach`
- `/keyword-research`
- `/keyword-clustering`
- `/competitive-landscape`
- `/competitor-analysis`
- `/link-prospecting`
- `/local-seo`
- `/seo-audit`

## Next step

Start with [SEO Project Setup](/docs/skills/seo-project-setup) if this is a new SEO project, or [SEO Coach](/docs/skills/seo-coach) if you are not sure which workflow to run first.
