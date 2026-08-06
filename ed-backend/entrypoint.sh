#!/bin/sh
set -e

# Wait for the database to accept connections (Postgres in compose/Dokploy).
python - <<'PY'
import os, time
url = os.environ.get("DATABASE_URL", "")
if url.startswith("postgres"):
    import psycopg
    for attempt in range(30):
        try:
            psycopg.connect(url, connect_timeout=3).close()
            print("database is ready")
            break
        except Exception as exc:
            print(f"waiting for database ({attempt + 1}/30): {exc}")
            time.sleep(2)
    else:
        raise SystemExit("database not reachable after 60s")
PY

python manage.py migrate --noinput
python manage.py collectstatic --noinput

# Optional: create a fresh superuser from env (replaces the old leaked admin).
# Set DJANGO_SUPERUSER_USERNAME / _EMAIL / _PASSWORD. Skipped if the user exists.
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
    python manage.py createsuperuser --noinput \
        --username "$DJANGO_SUPERUSER_USERNAME" \
        --email "${DJANGO_SUPERUSER_EMAIL:-}" \
        || echo "superuser already exists (skipping)"
fi

# Optional one-time data seed from a dumpdata JSON (see DEPLOY.md).
if [ -n "$LOAD_INITIAL_DATA" ] && [ -f "$LOAD_INITIAL_DATA" ]; then
    echo "Loading initial data from $LOAD_INITIAL_DATA"
    python manage.py loaddata "$LOAD_INITIAL_DATA" || echo "loaddata skipped/failed (continuing)"
fi

exec "$@"
