// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IMediProofVerifier.sol";

/// @title MediProofSettlement
/// @notice Hackathon reference contract for verifier-gated, replay-resistant claim settlement.
/// @dev Deploy only to a local chain/testnet with a real generated verifier and funded demo pool.
contract MediProofSettlement {
    address public owner;
    IMediProofVerifier public verifier;
    bytes32 public approvedHospitalRoot;
    mapping(bytes32 => bool) public usedNullifiers;
    
    bool private entered;

    modifier nonReentrant() { require(!entered, "Reentrant call"); entered = true; _; entered = false; }

    event HospitalRootUpdated(bytes32 indexed previousRoot, bytes32 indexed newRoot);
    event ClaimSettled(bytes32 indexed nullifier, bytes32 indexed policyCommitment, address indexed recipient, uint256 amount);
    

    error NotOwner();
    error InvalidVerifier();
    error InvalidClaim();
    error NullifierAlreadyUsed();
    error InvalidProof();
    error TransferFailed();

    modifier onlyOwner() { if (msg.sender != owner) revert NotOwner(); _; }

    constructor(address verifierAddress, bytes32 initialHospitalRoot) {
        if (verifierAddress == address(0)) revert InvalidVerifier();
        owner = msg.sender;
        verifier = IMediProofVerifier(verifierAddress);
        approvedHospitalRoot = initialHospitalRoot;
    }

    receive() external payable {}

    function setVerifier(address verifierAddress) external onlyOwner {
        if (verifierAddress == address(0)) revert InvalidVerifier();
        verifier = IMediProofVerifier(verifierAddress);
    }

    function updateHospitalRoot(bytes32 newRoot) external onlyOwner {
        emit HospitalRootUpdated(approvedHospitalRoot, newRoot);
        approvedHospitalRoot = newRoot;
    }

    /// @param a,b,c Groth16 proof coordinates produced by the real prover.
    /// @param publicInputs Circuit public signals in the exact order documented in circuits/README.md.
    /// @param nullifier Unique claim-context nullifier, domain-separated by the circuit/application.
    /// @param policyCommitment Commitment to the policy terms; must match the public circuit signal.
    /// @param recipient Payout recipient; must be bound as a public input in the circuit.
    /// @param amount Payout amount; must be bound as a public input in the circuit.
    function verifyAndSettle(
        uint256[2] calldata a,
        uint256[2][2] calldata b,
        uint256[2] calldata c,
        uint256[5] calldata publicInputs,
        bytes32 nullifier,
        bytes32 policyCommitment,
        address payable recipient,
        uint256 amount
    ) external nonReentrant {
        if (recipient == address(0) || amount == 0 || amount > address(this).balance) revert InvalidClaim();
        if (usedNullifiers[nullifier]) revert NullifierAlreadyUsed();

        // All five public inputs must match the application envelope.
        // Exact signal ordering and field conversion must be tested against the generated circuit.
        if (publicInputs[0] != uint256(approvedHospitalRoot)) revert InvalidClaim();
        if (publicInputs[1] != uint256(policyCommitment)) revert InvalidClaim();
        if (publicInputs[2] != uint256(nullifier)) revert InvalidClaim();
        if (publicInputs[3] != amount) revert InvalidClaim();
        if (publicInputs[4] != uint256(uint160(recipient))) revert InvalidClaim();

        if (address(verifier) == address(0) || !verifier.verifyProof(a, b, c, publicInputs)) revert InvalidProof();

        usedNullifiers[nullifier] = true;
        
        (bool ok,) = recipient.call{value: amount}("");
        if (!ok) revert TransferFailed();
        emit ClaimSettled(nullifier, policyCommitment, recipient, amount);
    }
}
