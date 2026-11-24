# Circuits

The current application does not contain a Circom circuit or Groth16 proving pipeline. This directory documents the intended integration boundary only.

Before adding a circuit, define public/private signals, units, nullifier derivation, registry-root semantics, and the threat model in `../docs/ZK_DESIGN.md`. Add reproducible valid and invalid witness tests. Never add a verifier that returns success unconditionally.
