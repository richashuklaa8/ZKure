# Privacy Model

## Data minimization goal

The design goal is to disclose only the claim facts required for a narrowly scoped coverage decision. The current app still stores and processes records off-chain; it does not yet provide cryptographic zero-knowledge minimization.

## Storage

The current backend describes AES-256-GCM payload encryption using per-record data keys and a wrapping key. Keep the encryption keyring outside source control and separate from database backups. Ciphertext alone is not enough for recovery: preserve IVs, authentication tags, wrapped keys, key versions, and related metadata.

## Consent

Patient permission controls govern application-mediated access. Revocation prevents future access through the app after enforcement, but it cannot delete copies already downloaded, exported, photographed, or independently retained by a recipient.

## Chain privacy

The intended chain boundary excludes raw medical records, diagnoses, prescriptions, keys, and private witnesses. Even ostensibly non-medical public data (provider, date, amount, commitment, repeated identifier) can leak sensitive facts through correlation. Avoid absolute claims such as "zero information disclosed."

## Demo rules

Use synthetic records only. Do not put real patient data or secrets in screenshots, logs, issues, test fixtures, or public deployments.
