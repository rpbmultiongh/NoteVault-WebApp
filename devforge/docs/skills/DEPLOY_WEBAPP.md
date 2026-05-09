# Cloudflare-Supabase Deployment Skill

## Purpose

Automates deployment of full-stack webapps using Cloudflare (Workers + Pages) and Supabase (PostgreSQL).

## When to Use

- Start a new webapp project with cloud backend
- Deploy React/Vite frontend with API backend
- Set up Supabase database for a webapp
- Configure CI/CD for Cloudflare deployment
- Debug cloud storage integration issues

## Workflow

### 1. Setup Phase

```bash
# Create Cloudflare API token
# 1. Go to https://dash.cloudflare.com/profile/api-tokens
# 2. Create Custom Token
# 3. Permissions: Workers Edit, Pages Edit
# 4. Save token securely

# Create Supabase project
# 1. Go to https://supabase.com
# 2. Create new project
# 3. Copy service_role key from Settings → API
```

### 2. Project Setup Phase

```bash
# Option A: Start from template (recommended)
cp -r /path/to/GoogleDriveClone-WebApp my-new-project
cd my-new-project
rm -rf .git && git init
# Update package.json, wrangler.toml, API endpoints

# Option B: Create from scratch
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm install idb  # For IndexedDB local storage
```

### 3. Database Setup Phase

Run in Supabase SQL Editor:

```sql
-- Core tables for any webapp
CREATE TABLE files (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT,
  size INTEGER,
  folder_id TEXT,
  storage_key TEXT,
  created_at BIGINT NOT NULL,
  modified_at BIGINT NOT NULL,
  is_deleted INTEGER DEFAULT 0
);

CREATE TABLE folders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  parent_id TEXT,
  created_at BIGINT NOT NULL,
  modified_at BIGINT NOT NULL,
  is_deleted INTEGER DEFAULT 0
);

-- Add indexes
CREATE INDEX idx_files_user ON files(user_id);
CREATE INDEX idx_folders_user ON folders(user_id);
```

### 4. API Setup Phase

Configure `wrangler.toml`:

```toml
name = "my-api"
compatibility_date = "2026-01-01"

[vars]
BACKEND_MODE = "supabase"
SUPABASE_URL = "https://your-project.supabase.co"
```

Deploy API and set secrets:

```bash
# Deploy API
npx wrangler deploy src/worker/api.ts --name my-api

# Set Supabase secret (REQUIRED)
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --name my-api
# Paste service_role key when prompted
```

### 5. Frontend Setup Phase

Create `.env` in frontend root:

```
VITE_MODE=cloud
VITE_API_URL=https://my-api.your-subdomain.workers.dev
```

Update API client (`src/utils/api.js`):

```javascript
const API_BASE = import.meta.env.VITE_API_URL;

function getUserId() {
  let userId = localStorage.getItem('app_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('app_user_id', userId);
  }
  return userId;
}
```

### 6. GitHub Actions Setup

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci && npm run build
      
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy src/worker/api.ts --name my-api
      
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: my-frontend
          directory: dist
          branch: production
```

Add GitHub Secrets:

| Secret | Value |
|--------|-------|
| CLOUDFLARE_API_TOKEN | From Cloudflare |
| CLOUDFLARE_ACCOUNT_ID | From Cloudflare |

### 7. Verify Phase

```bash
# Test API
curl "https://my-api.workers.dev/api/health"

# Push to trigger GitHub Actions
git push origin main

# Open deployed frontend
# Use Admin Panel (Ctrl+Shift+D) to verify
```

## Debug Commands

```bash
# Check API deployment
curl https://my-api.workers.dev/api/health

# Check tables exist in Supabase
# Go to Supabase → Table Editor

# Force fresh deploy
npx wrangler pages deploy dist --project-name=my-app --branch=production --commit-dirty=true

# Redeploy API
npx wrangler deploy src/worker/api.ts --name my-api --force

# List secrets
npx wrangler secret list --name my-api
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| CORS errors | Add CORS_HEADERS to Worker |
| Files not showing | Check userId matches |
| "Table not found" | Create tables in Supabase SQL Editor |
| Secret not set | `npx wrangler secret put NAME --name my-api` |
| Old code showing | Deploy with `--commit-dirty=true` |

## Output Template

After deployment, provide:

```
Deployment Complete! 🎉

Frontend: https://my-frontend.pages.dev
API: https://my-api.workers.dev
API Health: https://my-api.workers.dev/api/health

GitHub Actions: https://github.com/.../actions
Supabase Dashboard: https://supabase.com/dashboard/project/...
```

---

*Skill for harness-framework webapp deployment automation*
*2026-05-08*