# Zero-Knowledge Design (Planned)

## Intended statement

A future proof may establish that:
- a hospital leaf is included in an accepted Merkle registry root;
- a policy is active for the claim date;
- a procedure code is covered by the policy;
- the claim amount is no greater than the applicable policy limit; and
- the proof is bound to the exact public claim context.

## Private witness candidates

Policy attributes, procedure classification, private record commitments, Merkle path elements, and any patient-held secret required by the final protocol. The exact witness must be finalized by a cryptographic design review; this document is not a circuit specification.

## Public inputs candidates

Registry root, policy commitment, claim amount in a single documented unit, claim date/epoch, nullifier, and any recipient or claim context that must be bound. Public-signal ordering must be identical across prover, verifier, API, and contract.

## Current status

No Circom circuit, trusted setup artifacts, witness generator, proving key, verification key, or Groth16 verifier is included. The application must remain fail-closed rather than returning a success-shaped placeholder.

## Correctness limits

A circuit proves only its encoded arithmetic/logic. It cannot establish that a bill is genuine, that the hospital performed the treatment, that the patient consented outside the circuit, or that source data is legally authoritative. Those require separate trust and governance mechanisms.
