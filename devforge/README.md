# DevForge

**The AI-powered framework for building, deploying, and shipping full-stack webapps.**

DevForge is a harness framework that provides AI agents with the tools, skills, workflows, and protocols needed to rapidly build and deploy web applications using free-tier cloud services.

---

## Quick Start

### Build a WebApp

```bash
# Clone DevForge
git clone https://github.com/your-org/devforge

# Start building
cd devforge
# Use the skills to build your webapp
```

### Deploy to Cloud

```bash
# Deploy API
npx wrangler deploy src/worker/api.ts --name my-api

# Set secrets
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --name my-api

# Deploy frontend
npx wrangler pages deploy dist --project-name my-frontend
```

---

## What's Included

### Agents
AI personas for different tasks:
- `code-reviewer` - Quality assurance
- `test-engineer` - Testing and verification
- `security-auditor` - Security review

### Skills
Reusable task-specific skills:
- `webapp-development` - Build webapps
- `deploy-webapp` - Deploy to Cloudflare + Supabase
- `database-setup` - Set up Supabase
- `e2e-testing` - End-to-end testing

### Protocols
Standardized procedures:
- `SUPABASE_SETUP` - Database initialization
- `CLOUDFLARE_DEPLOY` - Cloudflare deployment

### Workflows
Complete automated workflows:
- `FULLSTACK_DEPLOY` - Full-stack deployment
- 6-step development lifecycle

### Tools
Automation tools:
- `evoagentx_tools.py` - Database, API, Deployment tools
- `deployment_workflow.py` - Workflow orchestration

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     DevForge                            │
├─────────────────────────────────────────────────────────┤
│  agents/      │ AI personas & best practices          │
│  skills/      │ Reusable task implementations          │
│  protocols/    │ Standardized procedures               │
│  workflows/    │ Automated multi-step processes       │
│  tools/        │ Code & CLI automation                │
│  docs/         │ Guides & references                 │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Your WebApp                          │
│  driveclone/  │ React + Vite + Cloudflare + Supabase  │
└─────────────────────────────────────────────────────────┘
```

---

## The Stack (Verified Working)

| Component | Service | Free Limit |
|-----------|---------|------------|
| Frontend | Cloudflare Pages | Unlimited |
| API | Cloudflare Workers | 100k/day |
| Database | Supabase PostgreSQL | 500MB |

**Total: $0/month**

---

## Documentation

- [DEPLOYMENT_GUIDE](docs/DEPLOYMENT_GUIDE.md) - Complete deployment guide
- [AGENT_INSTRUCTIONS](docs/AGENT_INSTRUCTIONS.md) - AI agent instructions
- [SKILL_MANIFEST](SKILL_MANIFEST.md) - All available skills
- [SPEC.md](SPEC.md) - Webapp specification template

---

## Example: Deploying GoogleDriveClone

```bash
cd devforge

# 1. Setup Supabase
#    → Run SQL from docs/protocols/SUPABASE_SETUP.md

# 2. Deploy API
npx wrangler deploy driveclone/src/worker/api.ts --name driveclone-api
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --name driveclone-api

# 3. Deploy Frontend
cd driveclone
npm run build
npx wrangler pages deploy dist --project-name=driveclone-frontend --branch=production
```

---

## License

MIT

---

*DevForge - Forge your ideas into production apps.*
