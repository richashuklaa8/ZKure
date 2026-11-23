# MediProof architecture

## Product
MediProof is a privacy-preserving healthcare claim verification network. It lets a hospital prove claim eligibility without disclosing diagnosis, procedure code, prescriptions, or treatment history to the insurer. Patients control access to encrypted record bundles.

## Three pillars
1. **Proof Without Disclosure + Merkle Verification** — approved-hospital membership, active policy, covered procedure, and amount-within-limit predicates.
2. **Patient Permission Vault** — encrypted off-chain records, on-chain commitments, grant/revoke workflows, and access events.
3. **ClaimGuard Settlement** — verifier-gated contract settlement, unique claim-context nullifier, replay rejection, and recipient/amount binding.

## Flow
Patient enrollment → hospital stores encrypted record off-chain → patient grants scoped access → hospital creates claim → ZK proof generated → insurer verifies public proof envelope → contract checks proof and unused nullifier → funded testnet pool settles → patient sees status, receipt, and access history.

## Data boundary
On-chain: approved-hospital root, policy commitment, claim amount, nullifier, record commitments, proof result, permission/audit events, settlement transaction.
Off-chain: full policy documents, identity mapping, diagnosis, procedure code, prescriptions, treatment history, encrypted record objects, encryption keys, registry evidence.

## Trust boundaries
A ZK proof verifies encoded predicates over authenticated inputs; it does not establish clinical truth, medical necessity, or honest source data. Registry governance, claim-date authentication, key release, recipient enrollment, and storage access enforcement remain critical trust boundaries.
