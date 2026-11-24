# Deployment and Operations

## Prototype deployment checklist

- Use a supported Node.js LTS runtime.
- Set a unique bootstrap admin password and a 32-byte encryption key.
- Set `CORS_ORIGINS` to exact trusted frontend origins.
- Keep secrets in the host's secret manager, never in Git.
- Restrict API network access and terminate TLS at a trusted reverse proxy/platform.
- Use persistent encrypted storage for SQLite; confirm the host does not discard local disk on redeploy.
- Back up the database and complete keyring separately, with access controls.
- Test restore and record decryption before relying on backups.
- Monitor logs without recording credentials, tokens, or medical payloads.

## Key rotation

Add a new key version while retaining old versions, set it as active, restart, then invoke the authenticated admin record key-rotation endpoint. Verify decryption and backup recovery before retiring any old key.

## Production blockers

SQLite operational resilience, distributed rate limiting, centralized secret management, security monitoring, formal data-retention policy, independent security review, regulatory/privacy review, and production-grade backup/restore need additional work. Do not use this prototype for real patient records or real settlement.
