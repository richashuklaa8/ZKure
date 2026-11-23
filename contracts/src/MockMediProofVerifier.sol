// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "./IMediProofVerifier.sol";
contract MockMediProofVerifier is IMediProofVerifier {
    bool public result = true;
    function setResult(bool value) external { result = value; }
    function verifyProof(uint256[2] calldata, uint256[2][2] calldata, uint256[2] calldata, uint256[5] calldata) external view override returns (bool) { return result; }
}
