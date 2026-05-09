# Cloudflare Deployment Guide for WebApps

This guide walks through deploying your webapp to Cloudflare for free.

---

## Prerequisites

1. **Cloudflare Account** - Sign up at https://cloudflare.com
2. **API Token** - Created in dashboard (Profile > API Tokens)

---

## Quick Deploy (One Command)

Run this on your local machine:

```bash
# Set your token
export CLOUDFLARE_API_TOKEN=your_token_here

# Deploy everything
curl -sL https://raw.githubusercontent.com/rpbmultiongh/GoogleDriveClone-WebApp/main/deploy.sh | bash
```

---

## Manual Deploy Steps

### Step 1: Get Credentials

1. Go to https://dash.cloudflare.com
2. Click your profile → **My Profile** → **API Tokens**
3. Create custom token with:
   - Zone: Edit
   - Worker Scripts: Edit
   - R2: Edit
   - D1: Edit

### Step 2: Clone & Enter

```bash
git clone https://github.com/rpbmultiongh/GoogleDriveClone-WebApp
cd GoogleDriveClone-WebApp
```

### Step 3: Set Environment

```bash
export CLOUDFLARE_API_TOKEN=your_token_here
export CLOUDFLARE_ACCOUNT_ID=your_account_id
```

### Step 4: Build

```bash
npm install
npm run build
```

### Step 5: Deploy Services

```bash
# R2 Bucket (file storage)
npx wrangler r2 bucket create driveclone-files

# D1 Database (metadata)
npx wrangler d1 create driveclone-db
npx wrangler d1 execute driveclone-db --file=migrations/001_initial.sql --remote

# API Worker
npx wrangler deploy src/worker/api.ts --name driveclone-api

# Frontend
npx wrangler pages project deploy dist --project-name=driveclone-frontend
```

---

## Get Your URLs

After deploy:
- **Frontend**: https://driveclone-frontend.rpbmultiongh.pages.dev
- **API**: https://driveclone-api.rpbmultiongh.workers.dev

---

## Troubleshooting

### Token Error
```
Error: Forbidden
```
→ Token doesn't have required permissions. Recreate with all Edit permissions.

### Authentication Required
```
401 Unauthorized
```
→ Set VITE_MODE=local in .env for testing, or implement auth.

### CORS Error
```
Access-Control-Allow-Origin
```
→ Add cors: true to your Worker config.

---

## Cost (Cloudflare Free Tier)

| Service | Free Limit |
|---------|------------|
| R2 Storage | 1GB |
| R2 Operations | 1M/month |
| D1 Database | 5MB |
| D1 Reads | 5M/month |
| Workers | 100K/day |
| Bandwidth | FREE! |

Total cost: **$0/month** for most use cases.