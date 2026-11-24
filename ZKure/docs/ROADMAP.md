# Roadmap and Implementation Status

This status reflects the supplied prototype source inspected when this repository package was assembled. Re-run checks and review code before treating it as current.

## Existing foundation
- [x] React + TypeScript + Vite frontend
- [x] Express API and SQLite persistence
- [x] Patient, Hospital, Insurer, and Admin experiences
- [x] Authenticated role-based workflows
- [x] AES-256-GCM encrypted record handling
- [x] Patient permission grant/revoke workflows
- [x] Security test file present

## Remaining engineering work
- [ ] Complete route-by-route authorization and input-validation audit
- [ ] Add shared request schemas and consistent API errors
- [ ] Add persistent/distributed rate limiting and tamper-evident audit storage
- [ ] Add full component, API, and end-to-end test coverage
- [ ] Specify and implement reviewed Circom circuit and witness generation
- [ ] Add real proof generation and verification with negative tests
- [ ] Implement registry Merkle root lifecycle and governance
- [ ] Implement Solidity verifier integration and on-chain nullifier enforcement
- [ ] Bind proof, claim, amount, recipient, and settlement context end-to-end
- [ ] Deploy and verify a testnet contract using test funds only
- [ ] Complete independent security, privacy, and deployment reviews

## Release rule

Do not mark a checkbox complete without running the relevant test or verifying the deployed artifact. Do not promote planned capabilities into the README's implemented feature list.
