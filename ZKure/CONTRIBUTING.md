# Contributing to ZKure

Thanks for helping improve ZKure. The project handles sensitive-data workflows, so correctness and honest capability claims matter more than adding surface area quickly.

## Before opening a pull request

1. Open or locate an issue describing the change.
2. Keep changes focused and preserve existing role and permission boundaries.
3. Never use real patient data, production credentials, private keys, or seed phrases.
4. Add or update tests, especially for authentication, authorization, encryption, permissions, and fail-closed behaviour.
5. Update documentation when API behaviour, security assumptions, or setup changes.

## Local checks

```bash
npm ci
npm run typecheck
npm run test
npm run build
```

## Pull requests

- Explain the problem and the chosen approach.
- Include screenshots for user-visible changes.
- State exactly which checks you ran and their outcomes.
- Call out migration, privacy, cryptographic, or deployment implications.
- Do not describe mocked or local-only behaviour as live blockchain or ZK functionality.

## Cryptography and contracts

Cryptographic circuit and contract changes require a design note, explicit public/private input definitions, adversarial test cases, and an independent review plan. Never introduce placeholder verifiers that accept all proofs or hard-coded success flags.
