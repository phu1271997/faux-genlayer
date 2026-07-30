# Changelog

All notable changes to the **Faux** deepfake bounty marketplace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to Semantic Versioning.

## [Unreleased]

## [1.2.0] — 2026-07-30

### Added
- **Milestone 1.2 — Multi-LLM Perspective Prompting**
  - Upgraded non-deterministic LLM prompt to evaluate claims from 3 expert perspectives (Forensic Analyst, Investigative Journalist, Skeptic).
  - Majority rule convergence (≥2 matching verdicts) determines final case verdict.
  - Added `perspectives_json` to `Case` storage struct to preserve per-expert reasoning on-chain.
  - Added [tests/test_perspectives.py](tests/test_perspectives.py) covering majority convergence and 1-1-1 split fallback.

## [1.1.0] — 2026-07-30

### Added
- **Milestone 1.1 — Security Hardening Bundle v1**
  - Prompt injection canary defense: Encapsulated untrusted user inputs inside `<USER_CLAIM_DESCRIPTION>` boundary tags.
  - Address normalization audit: Enforced lowercase hex formatting across all `_addr_str(Address)` calls.
  - Security documentation: Added [docs/SECURITY.md](docs/SECURITY.md) detailing threat model.
  - Unit tests: Added [tests/test_security.py](tests/test_security.py).

## [0.1.0] - 2026-07-30

### Added
- Initial project architecture documentation (`docs/ARCHITECTURE.md`).
- Project repository setup with `.gitignore`, initial `README.md`, and `CHANGELOG.md`.
