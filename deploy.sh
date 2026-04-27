#!/bin/bash
# Deploy script for DriveClone - Run locally

echo "=== DriveClone Deploy ==="
echo ""

# Check credentials
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "❌ Set CLOUDFLARE_API_TOKEN first"
  exit 1
fi

echo "✅ Credentials found"
echo ""

# 1. Create R2 Bucket
echo "📦 Creating R2 bucket..."
wrangler r2 bucket create driveclone-files 2>/dev/null || echo "Bucket may already exist"

# 2. Create D1 Database
echo "🗄️ Creating D1 database..."
wrangler d1 execute driveclone-db --remote --command "SELECT 1" 2>/dev/null || (
  wrangler d1 create driveclone-db --region us-east-1
)

# 3. Run migrations
echo "🔄 Running migrations..."
wrangler d1 execute driveclone-db --remote --file=migrations/001_initial.sql 2>/dev/null || echo "Migration skipped"

# 4. Deploy API Worker
echo "🚀 Deploying API Worker..."
cp src/worker/api.ts dist/worker.js
wrangler deploy src/worker/api.ts --name driveclone-api

# 5. Deploy Frontend via Pages
echo "🌐 Deploying Frontend..."
wrangler pages project deploy dist --project-name=driveclone-frontend

echo ""
echo "=== Done! ==="
echo "API: https://driveclone-api.rpbmultiongh.workers.dev"
echo "Front: https://driveclone-frontend.rpbmultiongh.pages.dev"