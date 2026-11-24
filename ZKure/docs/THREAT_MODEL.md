# Threat Model

## Assets

Patient records, encryption keys, account credentials, consent state, claim metadata, registry integrity, proof correctness, settlement funds, and audit history.

## Adversaries

Curious insurers, compromised hospital accounts, malicious insiders, external attackers, colluding participants, replay attackers, compromised infrastructure, and users attempting unauthorized role escalation.

## Key risks and controls

| Risk | Prototype control / status | Remaining concern |
|---|---|---|
| Unauthorized record access | Authenticated routes, role checks, patient grants | Review every route and object-level authorization |
| Database disclosure | AES-256-GCM encrypted payloads | Keyring, backups, host compromise, metadata exposure |
| Key loss | Versioned key wrapping and rotation endpoint documented | Operational recovery and tested backup restore |
| Consent revoked after export | App-level access can be revoked | Previously downloaded copies cannot be recalled |
| Fake hospital identity | Future registry membership design | Registry governance and source-of-truth validation |
| False source records / phantom billing | Not solved by encryption or ZK | Independent attestations, audits, anomaly detection |
| Replay / duplicate claim | Future nullifier enforcement | Must be enforced in contract and bound to claim context |
| Proof/public input mismatch | Proof pipeline not implemented | Strict public-signal order and contract-side binding |
| Metadata inference | Minimize public fields | Provider identity, amount, date, linkable commitments |
| Contract reentrancy / access abuse | Contract not implemented | Audited implementation and adversarial tests |

## Important limits

A valid proof only means the circuit's encoded statement is satisfied for the supplied witness. It does not prove the source data is true, that treatment happened, that care was medically necessary, or that a hospital is legally licensed. A Merkle inclusion proof only establishes membership under the supplied root; it does not validate registry governance or freshness.

## Release gates for future cryptography

- Document every public and private signal.
- Bind claim identifier, amount, recipient, policy commitment, registry root, and nullifier consistently.
- Reject duplicate nullifiers on-chain.
- Test altered signals and invalid proofs.
- Ensure the verifier fails closed.
- Have the circuit and contract independently reviewed before any production claim.
