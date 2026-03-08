# AGENTS.md

## Cursor Cloud specific instructions

### Architecture
- Grocery delivery platform: Express+TypeScript backend (`server/`) + 3 React Native/Expo mobile apps (`apps/customer|merchant|driver/`)
- Backend is the primary dev target in cloud — mobile apps require device/emulator, not runnable in cloud VM

### Backend server (`server/`)
- **Dev server**: `cd server && npm run dev` (uses `tsx watch`, port 3001)
- **Build**: `npm run build` (has pre-existing TS type errors — `tsx` ignores them at runtime)
- **Lint**: `npm run lint` — no `.eslintrc` config file exists yet, so this command fails
- **Test**: `npm run test` — no test files exist yet
- **Health check**: `GET http://localhost:3001/health`

### Database
- MongoDB 7.0 must be running before starting the server (server exits with code 1 on connection failure)
- Start MongoDB: `mongod --dbpath /data/db --logpath /var/log/mongodb/mongod.log --fork`
- Default URI: `mongodb://localhost:27017/grocery_delivery`

### Environment
- Copy `server/.env.example` to `server/.env` before first run
- Redis is optional (rate limiter falls back to in-memory)
- External services (Stripe, Twilio, S3, Firebase, Google Maps) are optional for basic dev

### Known issues in codebase
- `server/src/routes/address.ts` was missing (created as part of setup)
- `rateLimiter` export name mismatch was fixed in `rateLimiter.ts`
- Multiple pre-existing TypeScript strict-mode errors (do not block `tsx watch` runtime)
- `ioredis` not in `package.json` dependencies but imported in `rateLimiter.ts` — installed manually
