# Security Policy

## Project status

ZKure is an experimental prototype and is not approved for production healthcare, insurance or financial use.

## Reporting a vulnerability

Please do not publish exploitable details in a public issue. Contact the repository maintainers privately through the contact method listed on the GitHub profile. Include:
- Affected component and version/commit
- Impact and conditions required
- Reproduction steps or a minimal proof of concept
- Suggested mitigation, if known

Do not include real patient information, credentials, private keys or seed phrases.

## Current security boundaries

- Use synthetic data only.
- Do not use mainnet keys or real funds.
- The contract prototype uses a mock verifier in its current tests.
- Backend verification and settlement may be simulated.
- Circuit soundness, witness constraints, authorization, nullifier design, access control and deployment configuration require independent review before any production use.

## Disclosure

Please allow maintainers reasonable time to investigate and coordinate a fix before public disclosure.
