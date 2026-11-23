# 3-minute demo script

1. **Patient (30 sec):** open Overview, show encrypted record vault and on-chain/off-chain boundary. Grant Dr. Demo access to a selected record scope with an expiry.
2. **Hospital (45 sec):** switch to Hospital workspace, create a synthetic claim for ₹18,400, then run the clearly labelled demo eligibility checks.
3. **Insurer (45 sec):** switch to Insurer workspace, inspect public claim metadata and verify the workflow result. Explain that diagnosis and prescriptions are never shown in the insurer view.
4. **ClaimGuard (30 sec):** settle the verified synthetic claim. Show receipt and the replay-protection concept. Do not describe this as a real chain transaction.
5. **Negative path (30 sec):** create a claim above the configured policy limit or mark the hospital unapproved in the API payload; show rejection. Attempt a duplicate nullifier through API testing to demonstrate replay rejection.

Say clearly: this build has working local API workflows and synthetic data. Actual Groth16 proof generation, verifier deployment, encrypted file storage, wallet integration, and testnet settlement are integration milestones, not completed features.
