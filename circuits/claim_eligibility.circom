pragma circom 2.1.6;
include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";

// MediProof W3-01 circuit reference.
// Public signals (snarkjs order): hospitalRoot, policyCommitment, claimNullifier, claimAmount, recipient.
// Private signals: hospitalLeaf + Merkle path, policy terms, claim date, procedure membership path,
// patient secret and claim context. This circuit is a starter implementation; do not deploy it
// until the signed claim-date attestation and registry governance are integrated and tested.

template MerkleMembership(depth) {
    signal input leaf;
    signal input pathElements[depth];
    signal input pathIndices[depth];
    signal input root;
    signal output valid;
    signal cur[depth+1];
    component rootCheck = IsEqual();
    component h[depth];
    cur[0] <== leaf;
    for (var i=0; i<depth; i++) {
        pathIndices[i] * (pathIndices[i]-1) === 0;
        h[i] = Poseidon(2);
        h[i].inputs[0] <== cur[i] * (1-pathIndices[i]) + pathElements[i] * pathIndices[i];
        h[i].inputs[1] <== cur[i] * pathIndices[i] + pathElements[i] * (1-pathIndices[i]);
        cur[i+1] <== h[i].out;
    }
    rootCheck.in[0] <== cur[depth];
    rootCheck.in[1] <== root;
    rootCheck.out === 1;
    valid <== rootCheck.out;
}

template MediProofEligibility(depth) {
    // Public inputs in exact order. The recipient is bound to prevent payout redirection.
    signal input hospitalRoot;
    signal input policyCommitment;
    signal input claimNullifier;
    signal input claimAmount;
    signal input recipient;

    // Private inputs.
    signal input hospitalLeaf;
    signal input hospitalPathElements[depth];
    signal input hospitalPathIndices[depth];
    signal input policyId;
    signal input policyExpiry;
    signal input claimDate;
    signal input coveredProcedureRoot;
    signal input procedureLeaf;
    signal input procedurePathElements[depth];
    signal input procedurePathIndices[depth];
    signal input policyLimit;
    signal input patientSecret;
    signal input claimContext;

    component hospital = MerkleMembership(depth);
    hospital.leaf <== hospitalLeaf;
    hospital.root <== hospitalRoot;
    for (var i=0; i<depth; i++) {
        hospital.pathElements[i] <== hospitalPathElements[i];
        hospital.pathIndices[i] <== hospitalPathIndices[i];
    }

    component procedure = MerkleMembership(depth);
    procedure.leaf <== procedureLeaf;
    procedure.root <== coveredProcedureRoot;
    for (var j=0; j<depth; j++) {
        procedure.pathElements[j] <== procedurePathElements[j];
        procedure.pathIndices[j] <== procedurePathIndices[j];
    }

    // Bind the policy's terms to the public policy commitment.
    component policyHash = Poseidon(4);
    policyHash.inputs[0] <== policyId;
    policyHash.inputs[1] <== policyExpiry;
    policyHash.inputs[2] <== coveredProcedureRoot;
    policyHash.inputs[3] <== policyLimit;
    policyHash.out === policyCommitment;

    // Eligibility predicates.
    component dateCheck = LessThan(64);
    dateCheck.in[0] <== claimDate;
    dateCheck.in[1] <== policyExpiry;
    dateCheck.out === 1;
    component amountCheck = LessEqThan(64);
    amountCheck.in[0] <== claimAmount;
    amountCheck.in[1] <== policyLimit;
    amountCheck.out === 1;

    // Domain-separated claim-context nullifier. The application must ensure claimContext
    // is unique per submitted claim while allowing distinct legitimate claims for one patient.
    component nullifierHash = Poseidon(5);
    nullifierHash.inputs[0] <== patientSecret;
    nullifierHash.inputs[1] <== claimContext;
    nullifierHash.inputs[2] <== policyId;
    nullifierHash.inputs[3] <== 1296385097; // ASCII "MEDI" domain tag
    nullifierHash.inputs[4] <== recipient;
    nullifierHash.out === claimNullifier;

    // Recipient is public and contract-bound. This circuit does not authenticate the
    // recipient identity; enrollment/authorization must bind it to the intended beneficiary.
    // Recipient is included in the nullifier hash above, binding the public payout address.

}

component main {public [hospitalRoot, policyCommitment, claimNullifier, claimAmount, recipient]} = MediProofEligibility(20);
