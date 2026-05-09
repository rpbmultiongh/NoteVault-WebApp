# Auto-Deployment & Backend Setup Guide

A comprehensive guide for setting up cloud backends and auto-deployment for webapps.

---

## 🎯 What We Learned

**YES!** We now have a fully automated deployment pipeline for free-tier full-stack webapps:

| Component | Service | Cost | Automation |
|-----------|---------|------|------------|
| Frontend | Cloudflare Pages | FREE | GitHub Actions auto-deploy |
| API | Cloudflare Workers | FREE (100k/day) | GitHub Actions auto-deploy |
| Database | Supabase PostgreSQL | FREE (500MB) | Manual setup (one-time) |
| Debug Tools | Built-in Admin Panel | FREE | Ships with app |

**Pain-free future deployments!** 🎉

---

## Quick Deploy (One Command)

```bash
# Clone repo and auto-deploy
git clone https://github.com/rpbmultiongh/GoogleDriveClone-WebApp
cd GoogleDriveClone-WebApp

# Deploy everything
npm run build
npx wrangler deploy src/worker/api.ts --name your-api
npx wrangler pages deploy dist --project-name your-frontend
```

---

## Backend Setup Checklist

### Step 1: Cloudflare (Frontend + API)

1. Create Cloudflare account at https://dash.cloudflare.com
2. Get API Token: Dashboard → Profile → API Tokens → Create Custom Token
3. Permissions needed:
   - Workers Scripts: Edit
   - Pages: Edit

### Step 2: Supabase (Database + Storage)

1. Create account at https://supabase.com
2. Create new project
3. Get credentials from Settings → API:
   - Project URL
   - `service_role` key (click "reveal")

### Step 3: GitHub Secrets

Add to https://github.com/repo/settings/secrets/actions:

| Secret | Value |
|--------|-------|
| `CLOUDFLARE_API_TOKEN` | From Cloudflare dashboard |
| `CLOUDFLARE_ACCOUNT_ID` | From Cloudflare dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase Settings → API |

### Step 4: Set API Secret

```bash
# Only needed once per API
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --name your-api-name
```

---

## Database Setup (Run in Supabase SQL Editor)

```sql
-- Create files table
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

-- Create folders table
CREATE TABLE folders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  parent_id TEXT,
  created_at BIGINT NOT NULL,
  modified_at BIGINT NOT NULL,
  is_deleted INTEGER DEFAULT 0
);

-- Create indexes for faster queries
CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_folders_user_id ON folders(user_id);
```

---

## Architecture Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   User Browser  │────▶│ Cloudflare Pages│────▶│ Cloudflare      │
│                 │     │  (React/Vite)   │     │ Workers API     │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │    Supabase     │
                                                │  (PostgreSQL)   │
                                                └─────────────────┘

GitHub Push ──▶ GitHub Actions ──▶ Auto-Deploy to Cloudflare
```

---

## Key Lessons Learned (Don't Repeat Our Mistakes!)

### 1. CORS Headers Are Essential
```typescript
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
```

### 2. User ID Must Be Persistent
```javascript
function getUserId() {
  let userId = localStorage.getItem('drive_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('drive_user_id', userId);
  }
  return userId;
}
```

### 3. Test API with curl Before Debugging Frontend
```bash
curl "https://your-api.workers.dev/api/files?userId=test123"
```

### 4. Create Tables in Supabase Dashboard
Not just migrations - actually run the SQL in the SQL Editor.

### 5. Use service_role Keys (Not anon)
For full database access from the API.

### 6. Add Debug Tools to Every App
- Admin panel with console log capture
- API testing buttons
- User switching for testing

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| "Failed to upload" | Run `npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY` |
| "Table not found" | Run database setup SQL in Supabase SQL Editor |
| "Invalid key" | Regenerate API keys in Supabase |
| "CORS error" | Add CORS headers to Worker (see above) |
| "Files not showing" | Check userId matches - use Admin Panel to verify |
| "Old code showing" | Force deploy: `npx wrangler pages deploy dist --commit-dirty=true` |

---

## Environment Variables Reference

### Frontend (.env)
```
VITE_MODE=cloud
VITE_API_URL=https://your-api.workers.dev
```

### Worker (wrangler.toml)
```toml
[vars]
BACKEND_MODE = "supabase"
SUPABASE_URL = "https://your-project.supabase.co"
```

---

## Auto-Deployment GitHub Actions

The workflow (`.github/workflows/deploy.yml`) handles:

1. ✅ Push to main → auto-deploys to Cloudflare
2. ✅ Manual trigger via `workflow_dispatch`
3. ✅ Deploys API Worker
4. ✅ Deploys Frontend to Pages

### Manual Deploy
```bash
# Via GitHub Actions
gh workflow run deploy.yml

# Via CLI
npx wrangler deploy
npx wrangler pages deploy dist
```

---

## Cost Comparison

| Service | This Stack | Firebase | Heroku |
|---------|-----------|----------|--------|
| Database | FREE (500MB) | FREE (1GB) | $5/mo |
| Hosting | FREE unlimited | FREE | $7/mo |
| API/Serverless | FREE (100k/day) | $0.025/GB | $5/mo |
| Storage | FREE (1GB) | $0.02/GB | $5/mo |
| **Total** | **$0/month** | **~$0-10/mo** | **$17+/mo** |

---

## Future Projects: Copy This Template!

For any new project:

1. **Copy the repo structure:**
   ```
   my-project/
   ├── src/
   │   ├── App.jsx
   │   ├── components/
   │   ├── utils/api.js      ← Copy this!
   │   ├── utils/db.js       ← Copy this!
   │   └── worker/api.ts     ← Copy this!
   ├── wrangler.toml         ← Copy this!
   ├── .github/workflows/deploy.yml  ← Copy this!
   └── package.json
   ```

2. **Update these in api.ts:**
   - Supabase URL
   - Table names
   - API endpoints

3. **Set secrets once:**
   ```bash
   npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
   ```

4. **Deploy:**
   ```bash
   git push origin main  # Everything else is automatic!
   ```

---

## What's Already Automated

| Task | Status | How |
|------|--------|-----|
| Frontend build | ✅ Automated | GitHub Actions |
| API deployment | ✅ Automated | GitHub Actions |
| CORS headers | ✅ Built-in | Workers middleware |
| User ID management | ✅ Built-in | localStorage pattern |
| Error handling | ✅ Built-in | Admin Panel |
| Debug console | ✅ Built-in | Admin Panel |
| localStorage fallback | ✅ Built-in | When cloud fails |

---

## Contact & Links

- **Live App:** https://production.driveclone-frontend.pages.dev
- **API:** https://driveclone-api.driveclone.workers.dev
- **GitHub:** https://github.com/rpbmultiongh/GoogleDriveClone-WebApp
- **Supabase:** https://supabase.com/dashboard/project/spykxpepfpzrvnxdmjra

*Last updated: 2026-05-08*