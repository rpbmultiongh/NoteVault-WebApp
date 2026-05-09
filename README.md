# GoogleDriveClone + DevForge

A Google Drive clone webapp built with **DevForge** - an AI-powered framework for full-stack webapp development.

---

## Project Structure

```
├── driveclone/     # Your webapp (React + Vite + Cloudflare + Supabase)
│   ├── src/        # Frontend code
│   ├── worker/     # Cloudflare Workers API
│   └── .github/    # Auto-deployment
│
└── devforge/       # The DevForge framework
    ├── agents/     # AI personas
    ├── skills/     # Reusable skills
    ├── protocols/   # Setup protocols
    ├── workflows/   # Deployment workflows
    ├── tools/       # Automation tools
    └── docs/        # Guides & documentation
```

---

## Live App

**Frontend:** https://production.driveclone-frontend.pages.dev  
**API:** https://driveclone-api.driveclone.workers.dev/api/health

---

## Quick Commands

```bash
# Navigate to project
cd /path/to/project

# Deploy webapp (from driveclone folder)
cd driveclone
npm run build && npx wrangler pages deploy dist --project-name=driveclone-frontend --branch=production

# Deploy API
npx wrangler deploy src/worker/api.ts --name driveclone-api

# Set secret
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --name driveclone-api
```

---

## DevForge Framework

**DevForge** is a harness framework that provides AI agents with:
- Agents (code-reviewer, test-engineer, security-auditor)
- Skills (webapp-development, deploy-webapp, database-setup)
- Protocols (Supabase setup, Cloudflare deployment)
- Workflows (full-stack deploy, 6-step development lifecycle)
- Tools (EvoAgentX wrappers, deployment automation)

See [devforge/README.md](devforge/README.md) for full documentation.

---

## What Was Built

| Feature | Status |
|---------|--------|
| Cloud storage (Supabase) | ✅ Working |
| Local storage fallback | ✅ Working |
| Folder creation | ✅ Working |
| File upload | ✅ Working |
| Admin Panel debug tools | ✅ Working |
| Auto-deploy via GitHub Actions | ✅ Working |
| User ID management | ✅ Working |
| Dismissible cloud banner | ✅ Working |

---

*Built with DevForge - Forge your ideas into production apps.*