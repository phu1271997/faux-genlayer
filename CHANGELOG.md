# Changelog

All notable changes to the **Faux** deepfake bounty marketplace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to Semantic Versioning.

## [Unreleased]

## [1.1.0] — 2026-07-30

### Added
- **Milestone 1.1 — Security Hardening Bundle v1**
  - Prompt injection canary defense: Encapsulated untrusted user inputs inside `<USER_CLAIM_DESCRIPTION>` boundary tags with explicit LLM system instructions.
  - Address normalization audit: Enforced lowercase hex formatting across all `_addr_str(Address)` calls to eliminate case-mismatch storage lookups.
  - Math solvency zero-guards: Added division-by-zero checks on prorata payout calculations fallback.
  - Re-entrancy protection: Enforced atomic status update (`StakeRecord.claimed = True`) prior to external token transfers.
  - Security documentation: Added [docs/SECURITY.md](docs/SECURITY.md) detailing threat model, attack vectors, and audit findings.
  - Unit tests: Added [tests/test_security.py](tests/test_security.py) covering 5 distinct attack vectors.

## [0.1.0] - 2026-07-30

### Added
- Initial project architecture documentation (`docs/ARCHITECTURE.md`).
- Project repository setup with `.gitignore`, initial `README.md`, and `CHANGELOG.md`.
- Alignment with GenLayer studionet deployment constraints (D1, D2, D3).
