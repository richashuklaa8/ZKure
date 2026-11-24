# Smart Contract Design (Planned)

No Solidity contract or deployed verifier is included in the current implementation.

## Intended responsibilities

- Verify a genuine proof against a reviewed verifier.
- Bind the exact public-signal order and accepted registry root.
- Reject a previously used nullifier.
- Bind the settlement amount and recipient to the verified claim.
- Check available demo-pool funds before settlement.
- Emit events that contain only the minimum public information required.
- Restrict registry updates and emergency controls to governed roles.

## Required tests before deployment

Valid/invalid proof, modified public signals, duplicate nullifier, wrong recipient, wrong amount, unfunded pool, unauthorized registry update, paused state, reentrancy, and integer/unit conversion boundaries.

## Monetary units

Choose one base unit and document it across circuit, API, and contract. For INR-denominated examples, paise are integers (₹90,000 = 9,000,000 paise). Never mix rupees and paise or infer a payment from a UI label.

## Deployment policy

Use a public testnet and test funds only. Do not publish fabricated transaction hashes, contract addresses, or explorer links. Production payment rails require separate legal, regulatory, and operational review.
