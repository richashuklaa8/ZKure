# ZKure

**Verify the claim. Protect the patient.**

ZKure is an open-source prototype exploring privacy-preserving healthcare insurance claim verification. Its goal is to let an insurer validate narrowly scoped claim conditions without receiving a patient's complete medical history.

> **Project status:** prototype / active development. The current repository includes a React + TypeScript frontend, an Express API, SQLite persistence, authenticated role-based workflows, encrypted medical-record storage, and patient permission controls. It does **not** currently include a production zero-knowledge circuit, Groth16 proving pipeline, deployed Solidity verifier, or live on-chain settlement. Those capabilities are not represented as complete.

## Why ZKure

Healthcare claim workflows often require sharing more sensitive information than a payer needs for a specific decision. ZKure explores a narrower model: disclose the minimum public claim context and, in a future cryptographic integration, prove that policy and claim constraints are satisfied without revealing the underlying private witness.

The intended system has three pillars:

1. **Proof without disclosure** — prove selected claim predicates and hospital-registry membership while keeping the private witness off-chain.
2. **Patient permission vault** — encrypted record storage with explicit, revocable application-level access grants.
3. **ClaimGuard settlement** — a future smart-contract boundary that verifies a real proof, rejects reused claim nullifiers, binds the amount and recipient, and settles only from a funded demo pool.

## Current implementation

| Area | Present in this repository | Important boundary |
|---|---|---|
| Web application | React 18, TypeScript, Vite | Existing prototype UI and role-specific views |
| API | Express 5, TypeScript | Authenticated routes and server-side role checks |
| Persistence | SQLite | Suitable for local prototype use; not a production HA datastore |
| Authentication | scrypt password hashes; opaque sessions stored as SHA-256 digests | Review deployment cookie, origin, and session settings |
| Medical records | AES-256-GCM with per-record data keys and key wrapping | Keyring and database backups must be protected together |
| Permissions | Patient grant/revoke workflows | Revocation cannot erase copies already downloaded by a recipient |
| Zero knowledge | Not implemented yet | Claim submission remains fail-closed until real proof verification exists |
| Smart contracts | Not implemented yet | No deployed verifier, transaction, or settlement is claimed |

See [the architecture overview](docs/ARCHITECTURE.md) and [implementation status](docs/ROADMAP.md).

## Repository layout

```text
.
├── .github/                 # CI, issue forms, pull request template
├── docs/                    # Architecture, privacy, threat model, API and demo docs
├── public/                  # Static public assets
├── server/                  # Express API, database and demo dataset
├── src/                     # React application, pages, services and UI
├── tests/                   # Existing security tests
├── circuits/                # ZK integration design/status (not yet implemented)
├── contracts/               # On-chain integration design/status (not yet implemented)
├── scripts/                 # Developer utility scripts
├── .env.example             # Safe configuration template
└── package.json
```

## Quick start (Windows PowerShell)

Requirements: Node.js 20+ and npm.

```powershell
git clone https://github.com/richashuklaa8/ZKure.git
cd ZKure
npm ci

$env:BOOTSTRAP_ADMIN_EMAIL = 'admin@example.test'
$env:BOOTSTRAP_ADMIN_PASSWORD = 'replace-with-a-long-unique-password'
$env:RECORD_ENCRYPTION_KEY = (node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))")

npm run dev
```

The API defaults to `127.0.0.1:3001`; Vite serves the frontend on its configured development port. Set `CORS_ORIGINS` to an explicit comma-separated allowlist. Do not expose the development server directly to the public internet.

### macOS / Linux

```bash
git clone https://github.com/richashuklaa8/ZKure.git
cd ZKure
npm ci
export BOOTSTRAP_ADMIN_EMAIL='admin@example.test'
export BOOTSTRAP_ADMIN_PASSWORD='replace-with-a-long-unique-password'
export RECORD_ENCRYPTION_KEY="$(node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))")"
npm run dev
```

The first administrator is bootstrapped only when both bootstrap variables are present and no administrator already exists. Create linked Patient, Hospital, Insurer, and Admin accounts using the authenticated admin workflow. Never reuse the example credentials.

## Configuration

Copy `.env.example` to `.env` for local development and fill in values locally. `.env` is ignored by Git. At minimum configure:

- `BOOTSTRAP_ADMIN_EMAIL`
- `BOOTSTRAP_ADMIN_PASSWORD`
- `RECORD_ENCRYPTION_KEY` (32-byte key as 64 hexadecimal characters), or the versioned keyring variables
- `CORS_ORIGINS` for the exact frontend origin(s)

For versioned encryption-key rotation, configure `RECORD_KEYRING_JSON` and `RECORD_ACTIVE_KEY_VERSION` in a secret manager. Retain old key versions until all records wrapped under them have been rewrapped and backups have been verified. See [deployment and operations](docs/DEPLOYMENT.md).

## Commands

```bash
npm run dev             # API + Vite development servers
npm run dev:frontend    # Frontend only
npm run dev:server      # API only
npm run typecheck       # TypeScript check
npm run test            # Existing security tests
npm run build           # TypeScript check + production frontend build
npm run check           # Typecheck, tests, and production build
npm run preview         # Preview the Vite production build
```

## Security and privacy principles

- Medical records and encryption keys must never be written to a public blockchain.
- Hashing is not encryption; avoid hashing low-entropy medical values as a privacy mechanism.
- A ZK proof only establishes the constraints encoded in its circuit for the supplied inputs. It does not prove that a source record is truthful, treatment occurred, care was medically necessary, or a provider is legally licensed.
- A Merkle proof establishes inclusion under a particular root; it does not independently establish the legal validity or freshness of a registry.
- Application permission revocation blocks future access through this application; it cannot claw back previously downloaded or independently copied data.
- Public claim amounts, dates, provider identities, commitments, and repeated identifiers may reveal sensitive metadata even when diagnoses are hidden.
- Do not use real patient data in development, screenshots, demos, or tests.

Read [SECURITY.md](SECURITY.md), [the threat model](docs/THREAT_MODEL.md), and [privacy notes](docs/PRIVACY.md) before deploying.

## Demo and limitations

This project is a hackathon/research prototype, not a certified healthcare product, insurer integration, clinical system, or production payment rail. Do not use it to make real coverage decisions or transfer real funds. Seeded rows and demo workflows are not evidence of cryptographic verification or real-world impact.

See [the demo walkthrough](docs/DEMO.md) for a truthful walkthrough and [the ZK design](docs/ZK_DESIGN.md) for the proposed proof boundary.

## Contributing

Issues and pull requests are welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md), use the issue templates, and include tests for security-sensitive changes. Do not commit credentials, private keys, patient records, proving secrets, or generated production data.

## License

MIT. See [LICENSE](LICENSE).
