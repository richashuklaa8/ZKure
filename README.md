# ZKure

**A privacy-focused healthcare records and consent-management prototype.**

ZKure is a React + TypeScript frontend backed by an Express API and SQLite database. The supplied `arogyazk-main` source is the application baseline for this repository; the repository name and visible product branding are ZKure.

> **Prototype status:** This repository demonstrates authenticated patient-record workflows, consent controls, encrypted record storage, and role-specific interfaces. It is not a production healthcare system. Real zero-knowledge proof generation/verification, blockchain anchoring, insurer settlement, and emergency guardian recovery are not implemented and intentionally fail closed. Demo fixtures are synthetic.

## Problem

Healthcare workflows often require sharing sensitive patient information among patients, hospitals, and insurers. ZKure explores how authenticated access, scoped consent, and encrypted record storage can reduce unnecessary exposure of clinical notes.

## Current capabilities in this source

- Role-based application flows for Patient, Hospital, Insurer, and Admin.
- Express API authentication with expiring HttpOnly session cookies.
- Patient record creation and encrypted storage using AES-256-GCM.
- Patient-controlled, time-limited hospital record permissions.
- Audit-event and role-specific dashboard views.
- Optional upload of encrypted record ciphertext to a Kubo-compatible IPFS API.
- API health endpoint at `/api/health`.
- Security tests covering authentication, role checks, record confidentiality, consent expiry, and fail-closed unavailable integrations.

## Explicit integration limits

- No Circom circuit, witness generator, proving key, or verification key is included; real Groth16 proof generation is unavailable.
- No deployed verifier contract, RPC configuration, signing key, or settlement/payment integration is included.
- Blockchain explorer endpoints return no live chain data; no on-chain anchoring is performed.
- Break-glass request/signature flows are disabled until real guardian-signature verification and secret reconstruction exist.
- Record payloads are free text; FHIR R4/ABDM schema validation is not implemented.
- SQLite audit logs are not tamper-evident, and rate limits are process-local.
- Prototype fixture rows are synthetic and must not be treated as real patients, claims, proofs, transactions, or settlements.

## Technology stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling/UI | Tailwind CSS, Lucide React |
| API | Node.js, Express 5 |
| Database | Node.js built-in `node:sqlite` (SQLite) |
| Record encryption | Node.js crypto, AES-256-GCM, SHA-256 |
| Optional ciphertext storage | Kubo-compatible IPFS HTTP API |
| Tests | Node test runner via `tsx` |

## Architecture

```text
Browser
  └── React + Vite-built static assets
        │ same-origin /api requests
        ▼
      Express 5 (Node.js)
        ├── session authentication and role checks
        ├── record and consent endpoints
        ├── encrypted payload handling
        └── optional Kubo IPFS adapter
              │
              ▼
          SQLite database
```

The Express server serves the compiled `dist/` frontend when it exists, so the frontend and API can run in one Render Web Service.

## Project structure

```text
.
├── docs/
│   └── backend-architecture.md
├── server/
│   ├── db.ts
│   ├── index.ts
│   └── prototypeDataset.ts
├── src/
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   └── types/
├── tests/
│   └── security.test.ts
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

## Requirements

- Node.js **22.13.0 or newer** (uses the built-in `node:sqlite` module).
- npm (included with Node.js).

## Local setup

1. Clone the repository and enter its directory.
2. Install dependencies:

   ```bash
   npm ci
   ```

3. Copy `.env.example` to `.env` and set:
   - `BOOTSTRAP_ADMIN_EMAIL`
   - `BOOTSTRAP_ADMIN_PASSWORD` (at least 12 characters)
   - `RECORD_ENCRYPTION_KEY` (64 hexadecimal characters representing 32 bytes)

   Generate a key with:

   ```bash
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

4. Start the development frontend and API together:

   ```bash
   npm run dev
   ```

   Vite runs on `http://localhost:3000` and proxies `/api` to the API on `http://localhost:3001`.

The initial Admin account is provisioned only if both bootstrap variables are set and no Admin already exists. Sign in as Admin and create linked Patient, Hospital, and Insurer accounts using existing seeded registry IDs/names. Never commit `.env` or real secrets.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start Express API and Vite development server |
| `npm run build` | Type-check frontend and build production assets into `dist/` |
| `npm start` | Start Express; serves `dist/` and `/api` from one process |
| `npm run test:security` | Run API/security tests |
| `npm run preview` | Preview the Vite production build locally |

## Environment variables

| Variable | Required | Purpose |
|---|---:|---|
| `PORT` | Render supplies it | HTTP port |
| `HOST` | No | Defaults to `0.0.0.0` for Render |
| `BOOTSTRAP_ADMIN_EMAIL` | For initial Admin | First Admin email |
| `BOOTSTRAP_ADMIN_PASSWORD` | For initial Admin | First Admin password; minimum 12 characters |
| `RECORD_ENCRYPTION_KEY` | For new encrypted records | 32-byte key as 64 hex characters; compatibility fallback key |
| `RECORD_KEYRING_JSON` | No | JSON map of key versions to 64-character hex keys |
| `RECORD_ACTIVE_KEY_VERSION` | No | Active version in the keyring |
| `DATABASE_PATH` | No | SQLite database file path; defaults to `data/arogyazk.db` |
| `CORS_ORIGINS` | No | Comma-separated allowed origins; default is local Vite origin |
| `IPFS_API_URL` | No | Kubo-compatible API endpoint over HTTPS |
| `IPFS_API_TOKEN` | No | Optional bearer token for IPFS API |

For durable deployments, retain the full database and encryption keyring together in access-controlled backups. Loss of either can make encrypted records unrecoverable.

## Deploy to Render

Create or update a **Node.js Web Service** connected to this repository:

| Render setting | Value |
|---|---|
| Root Directory | Repository root (leave blank) |
| Build Command | `npm ci && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |
| Node version | `>=22.13.0` |

Set `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD`, and `RECORD_ENCRYPTION_KEY` as Render environment variables. Render supplies `PORT`; the server binds to `0.0.0.0`.

The app serves both the frontend and API from the same process; do not create a separate static-site service for this single-service setup.

**Render Free limitation:** the SQLite file is stored on an ephemeral filesystem and can be lost on restart, spin-down, or redeploy. Free web services cannot attach persistent disks. This is suitable only for a disposable hackathon/demo deployment, not durable patient data. For persistence, use a paid service with a disk mounted at `/var/data` and set `DATABASE_PATH=/var/data/zkure.db`, or migrate to a managed database. Do not use real patient information in this prototype.

Render free web services can spin down after inactivity, so the first request after idle may take time to respond.

## Tests and verification

Run:

```bash
npm ci
npm run build
npm run test:security
```

A successful build and test run should be recorded from the deployment environment before claiming the release is verified. The supplied archive has not yet passed these commands in this inspection environment because its dependency installation did not complete; see the deployment checklist in the accompanying handoff.

## Screenshots

No screenshots were included in the supplied source archive. Add genuine application screenshots here after running the project; do not use mock or illustrative images as product screenshots.

## Credits and acknowledgements

- The application source in this repository is based on the supplied `arogyazk-main` project archive.
- React, Vite, Express, Tailwind CSS, Lucide React, and the Node.js project ecosystem.
- Kubo-compatible IPFS API support is optional and must be configured independently.

## License

See the repository's existing `LICENSE` file. Preserve its terms when replacing the previous repository contents.
