# Supabase Database Setup Protocol

## Purpose

Standardized protocol for setting up Supabase databases for webapps.

## Pre-conditions

- Supabase account created
- Project created at https://supabase.com

## Steps

### Step 1: Get Credentials

From Project Settings → API:

```bash
# Save these values - you'll need them:
SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 2: Create Core Tables

Run in SQL Editor at https://supabase.com/dashboard → SQL Editor:

```sql
-- ============================================
-- CORE TABLES (copy for any webapp)
-- ============================================

-- Files table
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT,
  size INTEGER,
  folder_id TEXT,
  storage_key TEXT,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  modified_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  is_deleted INTEGER DEFAULT 0
);

-- Folders table
CREATE TABLE IF NOT EXISTS folders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  parent_id TEXT,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  modified_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  is_deleted INTEGER DEFAULT 0
);

-- ============================================
-- INDEXES (for performance)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_folder_id ON files(folder_id);
CREATE INDEX IF NOT EXISTS idx_files_deleted ON files(is_deleted);
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_folders_deleted ON folders(is_deleted);

-- ============================================
-- ROW LEVEL SECURITY (optional but recommended)
-- ============================================

ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- Allow all operations (for service_role access from API)
-- For anon key access, add more restrictive policies
CREATE POLICY "service_role_files_all" ON files
  FOR ALL USING (true);

CREATE POLICY "service_role_folders_all" ON folders
  FOR ALL USING (true);
```

Click **Run** to execute.

### Step 3: Verify Tables Created

1. Go to **Table Editor** in Supabase sidebar
2. You should see `files` and `folders` tables
3. Click on a table to see columns

### Step 4: Set Secret in Cloudflare

```bash
# Set in Cloudflare Workers
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --name your-api-name
```

### Step 5: Test Database Connection

```bash
# Via curl to your API
curl "https://your-api.workers.dev/api/files?userId=test123"
# Should return [] (empty array) for new user

# In Supabase Dashboard
# Go to Table Editor → files → View data
# Should be empty for new tables
```

## Customization for Other Apps

### For User Authentication Apps

Add to SQL:

```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);
```

### For Blog/Content Apps

```sql
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  status TEXT DEFAULT 'draft',
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  published_at BIGINT
);
```

## Troubleshooting

| Error | Solution |
|-------|----------|
| "relation does not exist" | Tables not created - run SQL in editor |
| "permission denied" | Check RLS policies, use service_role key |
| "invalid input syntax for type uuid" | ID column should be TEXT, not UUID |
| Tables not showing | Refresh Supabase dashboard |

## Exit Criteria

- [ ] Tables visible in Table Editor
- [ ] Can query via API
- [ ] Indexes created for performance
- [ ] service_role key set in Cloudflare secrets

---

*Protocol for harness-framework Supabase database setup*
*2026-05-08*