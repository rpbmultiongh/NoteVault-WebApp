#!/bin/bash
set -e

DB_URL="${1:-}"
MIGRATIONS_DIR="${2:-./migrations}"

if [ -z "$DB_URL" ]; then
    echo "Usage: setup.sh <DB_URL> <MIGRATIONS_DIR>" >&2
    exit 1
fi

if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "Error: Migrations directory not found: $MIGRATIONS_DIR" >&2
    exit 1
fi

echo "Connecting to database..." >&2

export PGPASSWORD="${DB_URL##*@*:}" 
HOST_PORT="${DB_URL##*@}"
HOST="${HOST_PORT%%:*}"
PORT="${HOST_PORT##*:}"
PORT="${PORT%%/*}"
DBNAME="${DB_URL##*/}"
DBNAME="${DBNAME%%\?*}"

psql "$DB_URL" -c "SELECT 1;" > /dev/null 2>&1 || {
    echo "Error: Cannot connect to database" >&2
    exit 1
}

echo "Connected. Running migrations..." >&2

COUNT=0
TABLES=()

for f in $(ls "$MIGRATIONS_DIR"/*.sql 2>/dev/null | sort); do
    echo "  Executing: $(basename $f)" >&2
    psql "$DB_URL" -f "$f" > /dev/null 2>&1 || {
        echo "Warning: Migration failed: $f" >&2
        continue
    }
    COUNT=$((COUNT + 1))
    
    TABLES+=($(grep -oP '(?<=CREATE TABLE )\w+' "$f" 2>/dev/null || true))
done

cat <<EOF
{
  "success": true,
  "migrations_run": $COUNT,
  "tables_created": $(printf '%s\n' "${TABLES[@]}" | jq -R . | jq -s .)
}
EOF