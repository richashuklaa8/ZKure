# W3-01 requirement traceability

| Requirement | Prototype location | Current status |
|---|---|---|
| Hospital membership against approved registry root | `circuits/claim_eligibility.circom` Merkle path | Circuit starter; registry governance/root updates remain to integrate |
| Active policy at claim date | Circuit policy commitment + expiry comparator | Comparator included; trusted claim-date attestation remains required |
| Procedure belongs to covered set | Procedure Merkle membership path | Circuit starter |
| Amount within policy limit | Circuit `LessEqThan` comparator | Circuit starter; local API also runs a labelled demo check |
| Verify proof in smart contract | `contracts/src/MediProofSettlement.sol` + verifier interface | Contract reference; generated verifier not included/deployed |
| Reject duplicate/replayed claims | Contract `usedNullifiers` + local API nullifier set | Implemented in reference contract and local demo API |
| Release payment after valid proof | Contract verifier gate and funded-pool transfer | Contract reference; local app records simulated receipt only |
| Encrypted records off-chain; hashes/commitments on-chain | Record vault UI + architecture docs | Synthetic metadata only; real encryption/storage integration remains |
| Patient grant/revoke doctor access | Permission API and Access control UI | Local demo workflow; real key-release enforcement remains |
| Patient/Hospital/Insurer workflow | Role switch and role-specific navigation | Interactive local prototype |
| Privacy architecture/threat model | `docs/ARCHITECTURE.md`, `docs/THREAT_MODEL.md` | Included |

## Demo claims versus real integrations

The dashboard and API are runnable local software. The demo verifier and demo settlement endpoints are simulations. The Circom and Solidity source files are integration starters and are not audited, formally verified, or deployed. Do not claim that the current ZIP generates real Groth16 proofs or makes blockchain transactions.
