# AGENTS.md

## Cursor Cloud specific instructions

### Project Overview
Grocery delivery platform with Express backend + 3 Expo React Native frontend apps.

### Services
| Service | Directory | Start Command | Port |
|---------|-----------|---------------|------|
| MongoDB | system | `mongod --dbpath /data/db --bind_ip 127.0.0.1 --port 27017 --fork --logpath /tmp/mongod.log` | 27017 |
| API Server | `server/` | `npm run dev` | 3001 |
| Customer App | `apps/customer/` | `npx expo start --web` | 19006 |
| Merchant App | `apps/merchant/` | `npx expo start --web` | 19006 |
| Driver App | `apps/driver/` | `npx expo start --web` | 19006 |

**Note:** All 3 Expo apps use webpack port 19006 (SDK 49 limitation). Run one at a time for web preview.

### Key Backend Commands
See `server/package.json`:
- **Dev**: `npm run dev` (tsx watch)
- **Build**: `npm run build` (tsc)
- **Lint**: `npm run lint` (eslint)
- **Test**: `npm run test` (jest)

### Gotchas
- MongoDB must be running before starting the backend; app calls `process.exit(1)` on failure.
- `chmod -R 777 /data/db` may be needed if MongoDB fails with permission errors.
- `.env` is copied from `.env.example`; keep `REDIS_URL` commented out unless Redis is installed.
- External services (Stripe, Twilio, Firebase, S3, Google Maps) degrade gracefully when unconfigured.
- TypeScript strict mode produces type errors in existing code; `tsx` ignores them at runtime.
- All 3 frontend API configs point to `http://localhost:3001/api/v1`.
- The driver app has React Native web compatibility warnings (react-native-maps, expo-location) which are expected in web mode.
- Health check: `GET http://localhost:3001/health`
- When starting an Expo app, kill ALL other Expo processes first (`ps aux | grep expo | grep -v grep | grep -v defunct | awk '{print $2}' | xargs kill 2>/dev/null`). The shared webpack port 19006 and Metro port 8081 will serve whichever app grabbed them first.
- Use `npx expo start --web --clear` to clear cached bundles when switching between apps.
- Verify the correct app is served: `curl -s http://localhost:19006 | grep "<title>"` should show the expected app name.
