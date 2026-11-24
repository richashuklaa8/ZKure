# Architecture

## Current system

```mermaid
flowchart LR
  U[Patient / Hospital / Insurer / Admin] --> FE[React + TypeScript UI]
  FE --> API[Express API]
  API --> AUTH[Authentication and role checks]
  API --> DB[(SQLite)]
  API --> ENC[AES-256-GCM record encryption]
  ENC --> DB
  API -. optional encrypted object upload .-> IPFS[Kubo-compatible IPFS]
```

The diagram describes the existing prototype boundary. It does not imply a deployed chain or a proof system.

## Intended privacy-preserving claim path

```mermaid
flowchart TD
  P[Patient authorizes scoped record use] --> H[Hospital prepares claim]
  H --> W[Private witness assembled off-chain]
  W --> PR[Future ZK prover]
  PR --> PF[Proof + explicitly defined public signals]
  PF --> IV[Future verifier]
  IV --> CG[Future ClaimGuard contract]
  CG --> N{Nullifier unused?}
  N -- no --> RJ[Reject replay]
  N -- yes --> AM{Amount and recipient bound?}
  AM -- no --> RJ
  AM -- yes --> ST[Future funded demo settlement]
```

Everything labelled future is a design target, not an implemented capability.

## Trust boundaries

- Browser: patient-controlled interaction and any future client-side secret material.
- API: authentication, authorization, encrypted record operations, and application workflow orchestration.
- Database/object storage: ciphertext and required cryptographic metadata.
- Future proof system: circuit constraints and proof generation/verification.
- Future chain: public commitments, registry root, nullifiers, verifier result, and settlement events only.

Do not place diagnoses, prescriptions, raw medical records, encryption keys, or private witnesses on-chain.
