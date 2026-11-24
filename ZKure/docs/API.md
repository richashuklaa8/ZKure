# API and Backend Notes

The Express API is implemented in `server/index.ts`; database and persistence helpers are in `server/db.ts`. The frontend API client is `src/services/api.ts`.

## Authentication and roles

The application uses Patient, Hospital, Insurer, and Admin roles. Sensitive endpoints require authenticated sessions and server-side role checks. Patient and hospital accounts are linked to existing entities; insurer accounts link to a registered insurer identity.

## Session model

Session tokens are delivered using HttpOnly, SameSite cookies and stored server-side as SHA-256 digests. Passwords are stored as scrypt hashes. Sessions expire after eight hours and sign-out revokes the current session.

## Record encryption

The backend uses AES-256-GCM with per-record data keys and wrapped keys. Versioned keyring settings support rotation. Keep the full keyring in a secret manager and preserve it with encrypted backups.

## API contract status

This document summarizes the current backend model, not a complete OpenAPI specification. Route schemas, pagination conventions, rate-limit strategy, and error response normalization remain areas for improvement. Consult the route handlers before relying on a particular endpoint.
