---
name: database-setup
description: Automated database setup and migration for Supabase/PostgreSQL backends
---

# Database Setup Skill

Automates database initialization, schema creation, and migration management for webapp backends.

## When to Use

- Initialize a new Supabase/PostgreSQL database
- Run SQL migrations automatically
- Verify database connectivity
- Check schema integrity

## Usage

```bash
bash skills/database-setup/scripts/setup.sh <DB_URL> <MIGRATIONS_DIR>
```

**Arguments:**
- `DB_URL` - PostgreSQL connection string (e.g., `postgresql://user:pass@host:5432/dbname`)
- `MIGRATIONS_DIR` - Path to directory containing SQL migration files

## Workflow

1. **Connect** - Establish database connection
2. **Validate** - Check if database exists
3. **Migrate** - Execute migration files in order
4. **Verify** - Confirm schema is correct

## Output

Returns JSON with migration status:
```json
{
  "success": true,
  "migrations_run": 3,
  "tables_created": ["files", "folders", "users"]
}
```

## Example

```bash
# Setup Supabase database
bash skills/database-setup/scripts/setup.sh \
  "postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres" \
  "driveclone/migrations"
```

## Troubleshooting

- **Connection timeout**: Check if IP is whitelisted in Supabase
- **Permission denied**: Use service role key, not anon key
- **Table exists**: Migrations use `CREATE TABLE IF NOT EXISTS`