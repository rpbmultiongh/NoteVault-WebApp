# DevForge Project Instructions

You are working in a project with two main components:

## Project Structure

```
├── driveclone/     # Your webapp
│   └── src/        # React + Vite frontend + Cloudflare Workers API
│
└── devforge/       # The DevForge AI coding framework
    ├── agents/     # AI agent personas (code-reviewer, test-engineer, security-auditor)
    ├── skills/     # Reusable development skills (26+ skills)
    ├── protocols/   # Standardized setup procedures
    ├── workflows/   # Automated deployment workflows
    ├── tools/       # EvoAgentX tool wrappers (Python)
    ├── docs/        # Guides and documentation
    └── SKILL_MANIFEST.md  # All available skills
```

## Working with the Webapp

**Webapp:** `driveclone/` - The Google Drive clone webapp

**Commands (from driveclone folder):**
```bash
npm run build                          # Build frontend
npx wrangler pages deploy dist --project-name=driveclone-frontend  # Deploy frontend
npx wrangler deploy src/worker/api.ts --name driveclone-api          # Deploy API
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --name driveclone-api  # Set secret
```

## DevForge Framework

**Framework:** `devforge/` - Use this for:
- Agent personas → `devforge/agents/`
- Development skills → `devforge/skills/`
- Setup protocols → `devforge/protocols/`
- Deployment workflows → `devforge/workflows/`
- Documentation → `devforge/docs/`

## Key Reference Files

| File | Purpose |
|------|---------|
| `devforge/docs/DEPLOYMENT_GUIDE.md` | Cloudflare + Supabase deployment |
| `devforge/docs/AGENT_INSTRUCTIONS.md` | AI agent instructions |
| `devforge/docs/EVOAGENTX_INTEGRATION.md` | EvoAgentX tools |
| `devforge/docs/protocols/SUPABASE_SETUP.md` | Database setup SQL |
| `devforge/docs/workflows/FULLSTACK_DEPLOY.md` | Deployment workflow |

## Tech Stack

- **Frontend:** React + Vite → Cloudflare Pages (FREE)
- **API:** Cloudflare Workers (FREE - 100k/day)
- **Database:** Supabase PostgreSQL (FREE - 500MB)
- **Total Cost:** $0/month

## Live URLs

- **Frontend:** https://production.driveclone-frontend.pages.dev
- **API:** https://driveclone-api.driveclone.workers.dev

---

*DevForge - Forge your ideas into production apps.*