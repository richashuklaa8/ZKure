# ZK circuit integration (Circom + Groth16)

`claim_eligibility.circom` is the circuit starter for the MediProof W3-01 proof path. It is deliberately separate from the UI's demo verifier. A green demo status is **not** a cryptographic proof.

## Public signals

In declared order: `hospitalRoot`, `policyCommitment`, `claimNullifier`, `claimAmount`, `recipient`.

The first four are the W3-01 public claim envelope; `recipient` is an additional public signal so the contract can bind the payout destination and prevent redirection. `claimAmount` must use the same canonical integer unit as the contract payout amount; the UI’s INR display is demo-only.

## Private signals

Hospital leaf and Merkle path; policy ID, expiry, covered-procedure root and limit; claim date; procedure leaf and Merkle path; patient secret; unique claim context.

## Local setup

Install Circom 2.1.6, then from this directory run:

```bash
npm install
npm run compile
snarkjs r1cs info claim_eligibility.r1cs
```

For a local-only prototype, create a powers-of-tau file using the documented snarkjs ceremony flow, run Groth16 setup, contribute entropy, export the verification key, and generate the Solidity verifier. Never reuse a development setup for production. Production requires a reviewed multi-party phase-2 ceremony.

## Security work required before relying on this circuit

- The claim date is private in this starter. A prover could choose a false date unless an authenticated hospital/insurer attestation is verified inside the circuit or the date is made public and bound to a trusted signed statement. Add and test that attestation path before claiming policy-active verification.
- The policy commitment must be generated with exactly the same Poseidon parameterization and canonical encoding on-chain/off-chain.
- The hospital registry root must be current, governed, and revocable; Merkle membership proves inclusion in the published tree, not legal licensure by itself.
- Procedure membership proves inclusion in a committed covered set, not medical necessity or clinical truth.
- Bind the payout recipient to authenticated enrollment, and bind all public inputs to the claim commitment.
- Add negative tests for wrong root, expired policy, uncovered procedure, over-limit amount, malformed path, wrong recipient, duplicate nullifier, and replay.
- Review circuit constraints and generated verifier independently. The starter has not been audited or formally verified.
