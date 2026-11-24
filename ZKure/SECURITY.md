# Security Policy

## Scope

ZKure is an experimental prototype. It is not approved for production healthcare processing, insurance adjudication, or payments.

## Reporting a vulnerability

Please do not publish exploitable details in a public issue. Contact the repository maintainers privately through the security contact configured in the GitHub repository. Include affected component, impact, reproduction steps, and a suggested mitigation when possible.

## Sensitive data

Never submit patient records, access tokens, passwords, private keys, seed phrases, encryption keys, or unredacted logs in an issue or pull request.

## Current security boundaries

- The current repository does not implement a real ZK proof system or deployed Solidity verifier.
- SQLite and local key configuration are prototype deployment choices, not a complete production security architecture.
- Permission revocation cannot erase recipient copies already exported.
- ZK statements cannot establish the truth of source records or medical necessity by themselves.

Please include negative tests for authorization failures and malformed input in security-related pull requests.
