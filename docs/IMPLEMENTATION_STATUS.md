# Implementation status — v2.0

## Working in this ZIP
- Responsive React dashboard with Patient, Hospital, and Insurer workspaces.
- Claims creation, eligibility demo checks, status changes, and simulated settlement receipts.
- Nullifier replay protection in the local demo API.
- Patient permission grant/revoke workflow with expiry validation.
- Synthetic encrypted-record inventory and access event logging.
- Express API with local JSON persistence under `backend/data/`.
- Solidity verifier-gated settlement reference contract and Hardhat project scaffold.
- Circom eligibility circuit starter and integration/security notes.

## Not yet production/chain-connected
- Groth16 setup, proof generation and generated verifier artifact.
- Wallet connection, contract deployment and actual transaction receipts.
- Real encrypted file upload/storage and key-release enforcement.
- Authenticated claim-date attestation and registry governance service.
- Formal circuit verification, contract audit, penetration testing, privacy review.

Never present simulated verification/settlement as a real cryptographic proof or on-chain transfer.

## Publication note

This repository snapshot is an experimental prototype. The mock verifier, simulated backend verification/settlement, and incomplete permission enforcement must not be represented as production functionality. Run and record tests before claiming they pass.
