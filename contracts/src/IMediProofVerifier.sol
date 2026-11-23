// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Interface expected from a generated Groth16 verifier.
/// @dev This interface alone does NOT verify proofs. Replace it with the generated verifier contract.
interface IMediProofVerifier {
    function verifyProof(
        uint256[2] calldata a,
        uint256[2][2] calldata b,
        uint256[2] calldata c,
        uint256[5] calldata input
    ) external view returns (bool);
}
