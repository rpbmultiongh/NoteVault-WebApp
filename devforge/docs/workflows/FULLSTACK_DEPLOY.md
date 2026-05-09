# Full-Stack Free Webapp Deployment Workflow

## Overview

This workflow documents the complete process for deploying full-stack webapps using free-tier services.

## Workflow: Deploy Full-Stack App

### Phases

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: Prerequisites Setup (One-time per service)           │
├─────────────────────────────────────────────────────────────────┤
│  □ Create Cloudflare account + get API token                    │
│  □ Create Supabase account + project                            │
│  □ Get Supabase service_role key                                │
│  □ Set up GitHub repo with secrets                              │
└─────────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: Project Setup                                         │
├─────────────────────────────────────────────────────────────────┤
│  □ Create React/Vite project or copy template                   │
│  □ Configure wrangler.toml with Supabase URL                    │
│  □ Create Worker API with CORS headers                          │
│  □ Create database tables in Supabase                           │
└─────────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3: Development & Testing                                 │
├─────────────────────────────────────────────────────────────────┤
│  □ Build API with Admin Panel debug tools                       │
│  □ Test API with curl before frontend integration               │
│  □ Add localStorage fallback for offline mode                    │
│  □ Verify CORS headers allow frontend requests                   │
└─────────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 4: Deployment                                            │
├─────────────────────────────────────────────────────────────────┤
│  □ Deploy API: npx wrangler deploy --name api-name              │
│  □ Set secrets: npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY│
│  □ Deploy frontend: npx wrangler pages deploy dist              │
│  □ Verify GitHub Actions workflow works                          │
└─────────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 5: Verification                                          │
├─────────────────────────────────────────────────────────────────┤
│  □ Test from browser (new user)                                 │
│  □ Upload file and verify in Supabase                           │
│  □ Check Admin Panel console logs                               │
│  □ Test user switching to verify isolation                      │
└─────────────────────────────────────────────────────────────────┘
```

## Step-by-Step Commands

### 1. Create New Project from Template

```bash
# Copy existing project structure
git clone https://github.com/rpbmultiongh/GoogleDriveClone-WebApp new-project
cd new-project
rm -rf .git
git init
git remote add origin https://github.com/your-username/new-project.git

# Update project name in package.json
# Update wrangler.toml worker name
# Update API URL references
```

### 2. Deploy API with Secrets

```bash
# Deploy the API Worker
npx wrangler deploy src/worker/api.ts --name my-new-api

# Set required secrets (NEVER commit these!)
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --name my-new-api
# Enter your service_role key when prompted

# Verify deployment
curl https://my-new-api.<your-subdomain>.workers.dev/api/health
```

### 3. Deploy Frontend

```bash
# Build
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist \
  --project-name=my-new-frontend \
  --branch=production

# Or via GitHub Actions (automatic on push)
git add .
git commit -m "Initial commit"
git push origin main
```

### 4. Verify Deployment

```bash
# Test API directly
curl "https://my-new-api.workers.dev/api/files?userId=testuser"

# Test from browser
# Open https://my-new-frontend.pages.dev
# Open DevTools → Console
# Check for errors
# Use Admin Panel (🛠) to debug
```

## Quality Checklist

Before considering deployment complete:

- [ ] API responds correctly to curl tests
- [ ] Frontend loads without errors
- [ ] Files upload successfully to cloud
- [ ] Files appear in Supabase dashboard
- [ ] Different users see only their own files
- [ ] Admin Panel works (Ctrl+Shift+D)
- [ ] CORS headers present on API responses
- [ ] localStorage fallback works when cloud fails
- [ ] GitHub Actions deploy on push to main

## Troubleshooting Workflow

### Problem: "Failed to load data" in browser

```
1. Open Admin Panel (🛠 button)
2. Go to API Test tab
3. Click "🚀 Test Direct cloudApi"
4. Check userId matches expected
5. Check console logs for errors
6. Verify API health check passes
```

### Problem: Empty file list for existing user

```
1. Check localStorage for drive_user_id
2. Use Admin Panel → Scan Users for Files
3. Click user with files to switch
4. Test again - should show files
```

### Problem: "Table not found" in Supabase

```
1. Go to Supabase Dashboard → SQL Editor
2. Paste database setup SQL
3. Click Run
4. Verify tables appear in Table Editor
```

### Problem: CORS errors

```
1. Check API response headers
2. Ensure "Access-Control-Allow-Origin: *"
3. Ensure OPTIONS method handled
4. Redeploy API if needed: npx wrangler deploy
```

## Integration with EvoAgentX

This deployment workflow can be automated using EvoAgentX patterns:

### Task Planning

```
Goal: Deploy a full-stack webapp with Cloudflare + Supabase
Subtasks:
  1. Configure Cloudflare credentials
  2. Set up Supabase database tables
  3. Deploy API Worker
  4. Set secrets
  5. Deploy frontend
  6. Verify deployment
```

### Code Templates

**api.ts template (copy and customize):**
```typescript
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Customize these functions for your app:
// - handleFiles()
// - handleFolders()
// - handleAuth()
```

**Frontend API client template:**
```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'https://default.workers.dev';

function getUserId() {
  let userId = localStorage.getItem('app_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('app_user_id', userId);
  }
  return userId;
}

// Customize endpoints for your app
```

---

*Part of the harness-framework for automated webapp deployment*
*2026-05-08*