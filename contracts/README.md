# MediProof contracts

`src/MediProofSettlement.sol` is the verifier-gated, replay-resistant settlement contract. `IMediProofVerifier.sol` is the interface implemented by the generated Groth16 verifier.

## Compile

From the repository root: `npm install`, then `npm run contracts:compile`.

## Deploy sequence (local/testnet only)

1. Compile the circuit and generate the Groth16 verifier using the reviewed setup procedure in `../circuits/README.md`.
2. Place the generated verifier contract in `contracts/src/` and confirm its signal order exactly matches the circuit and contract envelope.
3. Deploy the verifier.
4. Deploy `MediProofSettlement(verifierAddress, approvedHospitalRoot)`.
5. Fund the contract with testnet/native demo funds only.
6. Verify source on the chosen testnet explorer.

The settlement contract expects exactly five public inputs in this order: approved hospital root, policy commitment, claim nullifier, claim amount, recipient. Do not deploy against a placeholder verifier. No real funds or mainnet keys belong in this hackathon prototype.


**Amount units:** the reference contract transfers native testnet currency, so the circuit public amount and Solidity `amount` must use the same smallest-unit integer (for example wei). The dashboard displays synthetic INR values and is not wired to this contract. Add a reviewed conversion/payout-token design before integration.
