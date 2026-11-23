# MediProof threat model

| Threat | Mitigation in design | Remaining limitation |
|---|---|---|
| Diagnosis disclosure | Keep clinical inputs private to proof generation; share only public signals | Metadata and amount may still reveal patterns |
| Unapproved provider | Merkle membership against accepted registry root | Root governance and freshness must be trusted |
| Expired policy | Circuit compares claim date and expiry | Claim date needs authenticated attestation |
| Uncovered procedure | Membership proof against covered-procedure commitment | Does not prove clinical necessity |
| Over-limit amount | Circuit range comparison | Encoding and units must be canonical |
| Duplicate/replayed claim | Unique claim-context nullifier checked on-chain | Nullifier construction needs careful domain separation |
| Payout redirection | Recipient and amount bound as public inputs | Enrollment must authenticate beneficiary address |
| Unauthorized record access | Patient-scoped grant/revoke plus key-release enforcement | Revocation cannot erase downloaded copies |
| Key compromise | Encrypted off-chain storage and key separation | Production key management/recovery not implemented |
| Malicious contract/verifier | Reviewed verifier, tests, source verification | Current reference contract/circuit are unaudited |

## Prototype status
The current web API persists synthetic data locally. Its verification and settlement endpoints are explicitly demo simulations; they do not run a ZK prover, call a deployed contract, encrypt uploaded health records, or move funds.
