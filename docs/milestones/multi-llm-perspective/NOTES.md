# Milestone 1.2 — Multi-LLM Perspective Prompting (Notes & Plan)

## Target
Upgrade non-deterministic AI adjudication from a single-analyst perspective to a 3-expert perspective bundle (Forensic Analyst, Investigative Journalist, Skeptic) before converging on a final verdict.

## Structure
1. **Forensic Analyst:** Evaluates visual artifacts, metadata anomalies, and neural model hallmarks.
2. **Investigative Journalist:** Cross-references with news feeds, timeline logic, and source integrity.
3. **Skeptic:** Evaluates viral hoax patterns, prior debunks, and coordinated disinformation signals.
4. **Converged Verdict:** Majority rule (≥2 perspectives) determines verdict; 1-1-1 split defaults to `INCONCLUSIVE`.

## Files Updated
- `contracts/faux_core.py` (updated prompt and `Case` struct to hold `perspectives_json`)
- `frontend/src/pages/CaseDetail.tsx` (rendered 3 perspectives UI cards)
- `tests/test_perspectives.py` (unit tests for 3-agree, 2-1 split, and 1-1-1 split)
- `CHANGELOG.md` (updated for [1.2.0])
