# Deployment

The **backend** (`ed-backend`, Django + DRF) is containerized and deploys to
Dokploy as a Docker Compose app with a Postgres database. The **frontend**
(`ed-frontend`) is an Expo/React Native app — it is not a container; it runs in
Expo Go / a dev build and points at the deployed backend URL.

## 1. Local run with Docker Compose

```bash
cp .env.example .env        # edit secrets
docker compose up --build
```

- API: http://localhost:8000
- The `web` container waits for Postgres, runs `migrate` + `collectstatic`,
  then starts gunicorn (see `ed-backend/entrypoint.sh`).
- Data persists in the `pgdata` and `media` named volumes.

## 2. Environment variables

Set these in Dokploy (Environment) or the root `.env` for compose:

| Var | Purpose |
|-----|---------|
| `POSTGRES_DB` / `POSTGRES_USER` / `POSTGRES_PASSWORD` | Postgres credentials |
| `DJANGO_SECRET_KEY` | long random string |
| `DJANGO_DEBUG` | `false` in production |
| `DJANGO_ALLOWED_HOSTS` | comma list, e.g. `api.yourdomain.com` |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | e.g. `https://api.yourdomain.com` |
| `DATABASE_URL` | set automatically by compose to the `db` service |
| `LOAD_INITIAL_DATA` | optional path to a dumpdata JSON to seed on first boot |

## 3. Dokploy

1. Create a **Compose** application pointing at this repo (compose file:
   `docker-compose.yml`).
2. Add the environment variables above.
3. Route your domain to the `web` service (port 8000). Traefik terminates TLS;
   Django trusts `X-Forwarded-Proto` via `SECURE_PROXY_SSL_HEADER`.
4. Deploy. The entrypoint migrates and collects static automatically.

You can instead use a Dokploy-managed Postgres and drop the `db` service —
just set `DATABASE_URL` to that instance.

## 4. Migrating existing SQLite data to Postgres

The old data lives in `ed-backend/db.sqlite3`. Export it from an environment
that has the Django deps (e.g. your current dev machine), then load it into the
Postgres-backed container.

```bash
# From ed-backend, against the OLD sqlite DB (leave DATABASE_URL unset):
python manage.py dumpdata \
  --natural-foreign --natural-primary \
  -e contenttypes -e auth.permission -e admin.logentry -e sessions.session \
  --indent 2 > seed.json
```

Then either:

- **Automatic seed:** put `seed.json` in `ed-backend/`, set
  `LOAD_INITIAL_DATA=/app/seed.json`, and deploy (loaded once after migrate); or
- **Manual:** `docker compose exec web python manage.py loaddata /app/seed.json`

Auth tokens are preserved, so existing users stay logged in. Content types and
permissions are excluded so they regenerate cleanly on Postgres.

> Note: `db.sqlite3` is still tracked in git as the data source for this
> migration. Once migrated, consider `git rm --cached ed-backend/db.sqlite3`.

## 5. Frontend configuration

In `ed-frontend/.env` (copy from `.env.example`):

```
API_BASE_URL=https://api.yourdomain.com
GOOGLE_MAPS_ANDROID_API_KEY=<your key>   # Android maps only; iOS uses Apple Maps
```

Restart Metro with a clean cache after changing env: `npx expo start -c`.
For a production build use EAS (`eas build`).
