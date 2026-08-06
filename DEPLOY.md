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

## 4. Database

Postgres only — there is no sqlite fallback. `migrate` runs automatically on
boot (see `ed-backend/entrypoint.sh`) and creates the schema on the empty
Postgres volume; the app starts with a fresh database.

Create the first admin by setting these before deploy (the entrypoint runs
`createsuperuser --noinput`, skipping if the user already exists):

```
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@your-domain.com
DJANGO_SUPERUSER_PASSWORD=<long random>
```

> The old `db.sqlite3` was removed from the repo: it contained real password
> hashes and a live auth token. It remains in git history and the repo is
> public — rotate those credentials, purge the history (`git filter-repo`),
> and consider making the repo private. See §6.

## 5. Frontend configuration

In `ed-frontend/.env` (copy from `.env.example`):

```
API_BASE_URL=https://api.yourdomain.com
GOOGLE_MAPS_ANDROID_API_KEY=<your key>   # Android maps only; iOS uses Apple Maps
```

Restart Metro with a clean cache after changing env: `npx expo start -c`.
For a production build use EAS (`eas build`).

## 6. Security follow-ups (leaked `db.sqlite3`)

`ed-backend/db.sqlite3` was committed to a **public** repo. It exposed:

- superuser `admin` (`avaleria1x969@gmail.com`) — pbkdf2 hash
- user `bubbs` (`bubbs@gmail.com`) — pbkdf2 hash
- a non-expiring DRF auth token for `bubbs`

Removing the file from the working tree does **not** un-leak it (still in history
and possibly cached/cloned). Required actions:

1. **Rotate** — treat both accounts and the token as compromised. Fresh Postgres
   DB starts clean; recreate the admin via `DJANGO_SUPERUSER_*` (§4). If any old
   credential is reused elsewhere, change it.
2. **Purge history** — `git filter-repo --path ed-backend/db.sqlite3 --invert-paths`,
   then force-push. Rewrites history for all clones.
3. **Repo visibility** — make it private, or accept the leak as permanent.
4. **`SECRET_KEY`** — the fallback in `settings.py` / compose default is public;
   always set a real `DJANGO_SECRET_KEY` in the environment.
