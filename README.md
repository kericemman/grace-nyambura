# Grace Nyambura website and content platform

Production-oriented personal-brand website and publishing platform for Grace Nyambura.

## Requirements

- Node.js 20.19 or newer
- npm 10 or newer
- MongoDB connection string
- Cloudinary and Resend credentials for their integration phases

## Local setup

1. Run `npm install` from the repository root.
2. Copy `client/.env.example` to `client/.env` if the default API path is unsuitable.
3. Copy `server/.env.example` to `server/.env` and provide private values. An existing private `server/.env` may already be present; never commit it.
4. Run `npm run dev` to start the client on port 5173 and API on port 5000.
5. Check `http://localhost:5000/api/v1/health` for API readiness.

## Commands

- `npm run dev`: start both workspaces in watch mode.
- `npm run build`: build the frontend production bundle.
- `npm run check`: run frontend linting and API tests.
- `npm start`: start the production API after configuration.

See [architecture](docs/architecture.md) and [initial audit](docs/initial-audit.md) for current decisions and outstanding source material.
# grace-nyambura
