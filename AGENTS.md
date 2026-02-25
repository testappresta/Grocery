# AGENTS.md

## Cursor Cloud specific instructions

### Project Overview
Grocery delivery backend API (Express + TypeScript + MongoDB). Single service at `server/`.

### Services
| Service | How to start | Port |
|---------|-------------|------|
| MongoDB | `mongod --dbpath /data/db --bind_ip 127.0.0.1 --port 27017 --fork --logpath /tmp/mongod.log` | 27017 |
| API Server | `cd server && npm run dev` | 3001 |

### Key Commands
See `server/package.json` scripts:
- **Dev**: `npm run dev` (tsx watch, hot-reload)
- **Build**: `npm run build` (tsc)
- **Lint**: `npm run lint` (eslint)
- **Test**: `npm run test` (jest, currently no test files)

### Gotchas
- MongoDB must be running before starting the server; the app calls `process.exit(1)` on connection failure.
- `chmod -R 777 /data/db` may be needed if MongoDB fails with permission errors.
- `.env` is copied from `.env.example`. Keep `REDIS_URL` commented out unless Redis is installed (avoids needing `ioredis` at runtime, falls back to in-memory rate limiter).
- External services (Stripe, Twilio, Firebase, S3, Google Maps) degrade gracefully when not configured.
- TypeScript strict mode produces type errors in existing code; `tsx` ignores them at runtime.
- Health check: `GET http://localhost:3001/health`
