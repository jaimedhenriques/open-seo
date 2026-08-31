# SearchCrew

> SEO and GEO intelligence for people and AI agents

SearchCrew is an SEO and GEO platform for people who find Semrush and Ahrefs expensive and bloated. Pay-as-you-go pricing, and full MCP and API access on every plan — including Free, where the incumbents gate it behind their top tier.

> All-in-one SEO tool for you and your AI agent.

Connect with any agent like Claude Code, OpenClaw or Hermes. We have pre-built skills, but you can build your own to tailor SearchCrew to your needs.

<img width="1385" height="794" alt="Image" src="https://github.com/user-attachments/assets/fd208249-44ea-4849-bb4b-5fc896aeab73" />

## Hosted Version

Hosted signup and billing are paused while the production app, support, and legal details are verified. The public SEO ROI calculator remains available without an account.

[searchcrew.ai](https://searchcrew.ai)

## Why use SearchCrew?

- Best in class MCP and AI Skills.
- Modern, simple UI.
  - Focused workflows instead of a bloated, complex SEO suite.
- Full MCP and API access on every plan, including Free.
  - No higher tier required to let an agent reach your SEO data.
- Credits roll over, so unused spend is never confiscated.

## Main SEO Workflows

- Keyword research
- Rank tracking
- Competitor Insights
- Backlinks
- Site Audits
- AI Visibility

## SearchCrew MCP & Agent Skills

SearchCrew exposes an MCP server so AI agents like Claude Code, OpenClaw, and Hermes can use your SEO data directly. Agent Skills are reusable workflows that guide your agent through SEO tasks using the MCP.

- [Set up SearchCrew MCP](https://searchcrew.ai/docs/mcp)
- [Set up SearchCrew Agent Skills](https://searchcrew.ai/docs/skills/setup)

## Self-Hosting

SearchCrew supports two self-hosting paths:

- **Simple: Docker (Best for testing it out)** - For personal use on your own machine. See [`docs/SELF_HOSTING_DOCKER.md`](./docs/SELF_HOSTING_DOCKER.md).
  - Unless you already are self-hosting other apps and are confident doing so, we recommend self-hosting with Cloudflare as opposed to Railway, Coolify or Dokploy.
  - We plan to make it simpler to host on those platforms in the next few months.
- **Recommended: Cloudflare** - For internet-facing self-hosting across multiple devices or with your team (works on the free plan). See [`docs/SELF_HOSTING_CLOUDFLARE.md`](./docs/SELF_HOSTING_CLOUDFLARE.md).

Either way, you need a DataForSEO API key to get SEO data. See [`docs/DATAFORSEO_API_KEY.md`](./docs/DATAFORSEO_API_KEY.md).

## Costs

SearchCrew needs a [DataForSEO](https://dataforseo.com/?aff=255379) API key so that you can get SEO data. You pay them directly when self hosting.

See [searchcrew.ai/pricing](https://searchcrew.ai/pricing)

When you self host, your costs will be slightly lower than the estimates on our website. The way the hosted service makes money is by charging 28% extra for every request we make to DataForSEO.

## Local Development

See [`docs/LOCAL_DEVELOPMENT.md`](./docs/LOCAL_DEVELOPMENT.md).

## Contributing

Creating clear issues is the best way to contribute.

Read more here: [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md)

We have this skill: `/simple-issue-description` which helps.

```sh
npx skills add jaimedhenriques/searchcrew --skill simple-issue-description
```

## Community

See current support and launch status at [searchcrew.ai/support](https://searchcrew.ai/support).
