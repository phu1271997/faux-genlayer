# Forensic AI Adjudication & Source Authority Methodology

## 1. Multi-Source Web Fetching
GenLayer validators fetch the primary `media_url` and up to 3 context URLs directly on-chain using `gl.nondet.web.render(url, mode='text')`.

## 2. Multi-LLM Perspective Convergence
Adjudication prompts query 3 expert personas:
1. **Forensic Analyst:** Image/audio artifacts, diffusion halos, spectrogram boundaries.
2. **Investigative Journalist:** News cross-references, timeline plausibility, source reputation.
3. **Skeptic:** Misinformation patterns, prior debunks, manipulation signatures.

Verdict convergence requires \(\ge 2\) matching expert decisions.

## 3. Source Authority Weighting
Evidence from established archival or fact-checking domains (Reuters, AP, Snopes, PolitiFact) is assigned higher authority weighting during LLM prompt evaluation.
