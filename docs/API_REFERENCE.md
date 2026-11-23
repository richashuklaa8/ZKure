# Local API reference

Base URL in development: `http://localhost:4000/api` (the Vite app proxies `/api` automatically).

| Method | Route | Purpose |
|---|---|---|
| GET | `/health` | API health and demo-mode status |
| GET | `/dashboard` | Claims, records, permissions and audit events |
| GET | `/claims` | List synthetic claims |
| GET | `/claims/:id` | Read one claim |
| POST | `/claims` | Create synthetic claim; JSON body `{ "amount": 18400 }` |
| POST | `/claims/:id/verify-demo` | Run clearly labelled demo eligibility checks |
| POST | `/claims/:id/settle-demo` | Record simulated settlement after demo verification |
| GET | `/records` | List synthetic record metadata |
| POST | `/records/:id/access-demo` | Record an access event; does not open a medical file |
| POST | `/permissions` | Grant a scoped permission with expiry |
| PATCH | `/permissions/:id/revoke` | Revoke future access in the demo service |
| GET | `/audit` | List recent audit events |

All records are synthetic. The API has no authentication and is intended for localhost-only hackathon demonstration.
