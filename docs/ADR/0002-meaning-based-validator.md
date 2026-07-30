# ADR 0002: Meaning-Based Consensus Validation

## Context
LLMs produce free-text variations in reasoning explanations (`reason`), causing rigid string equality validators to fail consensus unnecessarily.

## Decision
Validator function checks decision bucket (`mine['verdict'] == leader['verdict']`) and confidence tier (\(\pm 15\)), ignoring exact wording in `reason`.

## Status
Accepted.
