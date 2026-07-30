# Faux — Deepfake Bounty Marketplace

> **Neutral court for "Is this media fake?"** — Stake GEN on your judgment, powered by GenLayer's decentralized AI jury.

---

## 1. The Problem

With the proliferation of generative media in 2024–2026, distinguishing between authentic and manipulated media (photos, audio, videos) is increasingly difficult. Centralized platforms (Twitter/X, YouTube, Meta) suffer from single-point bias, inconsistent moderation, and arbitrary account suspensions. 

There is no neutral, incentive-aligned, public court where community participants can stake skin in the game while an AI jury evaluates evidence transparently on-chain.

---

## 2. Why GenLayer?

Faux relies fundamentally on three capabilities that traditional EVM smart contracts cannot provide:

1. **Unstructured Multi-Source Evidence Processing:** LLMs on GenLayer evaluate unstructured text, page metadata, reverse-search articles, and forensic descriptions directly on-chain.
2. **Direct Web Access without Centralized Oracles:** `gl.nondet.web.render` fetches evidence from media URLs and context sources natively on-chain.
3. **Subjective AI Consensus:** Optimistic Democracy enables a network of diverse LLM validators to reach consensus on subjective questions ("Is this media manipulated?"), comparing verdict buckets and confidence tiers rather than rigid string matches.

> *Remove the AI and web layer, and Faux collapses into a broken escrow. That's the point.*

---

## 3. System Architecture

Faux consists of five interconnected Intelligent Contracts on GenLayer **studionet**:

- **`FauxCore` (`contracts/faux_core.py`):** Handles case creation, community staking, non-deterministic multi-perspective AI adjudication, and payout execution.
- **`FauxTreasury` (`contracts/faux_treasury.py`):** Securely holds escrowed GEN funds, collects a 2% protocol fee, and emits payouts.
- **`FauxReputation` (`contracts/faux_reputation.py`):** Tracks accuracy metrics for stakers, reputation tiers (Bronze/Silver/Gold/Diamond), and tiered fee discounts.
- **`FauxAppeal` (`contracts/faux_appeal.py`):** Handles community case dispute appeals.
- **`FauxBadges` (`contracts/faux_badges.py`):** Mints on-chain Soulbound Badges for staker achievements.

For complete sequence diagrams and data flow details, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 4. Deploying to GenLayer Studionet

Faux is deployed on **GenLayer studionet** via [GenLayer Studio](https://studio.genlayer.com).

### Step-by-Step Deployment Guide

1. Open [GenLayer Studio](https://studio.genlayer.com/run-debug).
2. Go to **Settings -> Reset Storage -> Confirm** and hard-refresh your browser.
3. Deploy the contracts in order:
   - `contracts/faux_treasury.py`
   - `contracts/faux_reputation.py`
   - `contracts/faux_core.py`
   - `contracts/faux_appeal.py`
   - `contracts/faux_badges.py`
4. Inspect each transaction sidebar to verify **`Result: SUCCESS`** (ensure `Status: FINALIZED` is paired with `Result: SUCCESS`).
5. Execute `Core.set_dependencies(treasury_address, reputation_address)` once to link the contracts.
6. Copy the deployed contract addresses into `frontend/.env`:
   ```env
   VITE_CONTRACT_CORE_ADDR=0xdB2465BC1F7D148e4078892C9dC679a45CBC03fD
   VITE_CONTRACT_TREASURY_ADDR=0x4318EC4C34d5D7CB6d73686a5e8514F7BA3e203e
   VITE_CONTRACT_REPUTATION_ADDR=0x71cB013F7a4c0C09769Ebfd77b27F080ca147462
   ```

---

## 5. Deployed Contract Addresses

| Contract | Network | Address | Explorer Link |
|---|---|---|---|
| **FauxCore** | GenLayer studionet | `0xdB2465BC1F7D148e4078892C9dC679a45CBC03fD` | [GenLayer Explorer](https://genlayer-explorer.vercel.app) |
| **FauxTreasury** | GenLayer studionet | `0x4318EC4C34d5D7CB6d73686a5e8514F7BA3e203e` | [GenLayer Explorer](https://genlayer-explorer.vercel.app) |
| **FauxReputation** | GenLayer studionet | `0x71cB013F7a4c0C09769Ebfd77b27F080ca147462` | [GenLayer Explorer](https://genlayer-explorer.vercel.app) |

---

## 6. Running the Frontend Locally

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` or live production dApp at `https://faux-genlayer.vercel.app`. Ensure your MetaMask wallet is connected to **GenLayer Studio Network** (`studionet`, Chain ID `61999` / `0xF1EF`) and funded with GEN tokens from the **Accounts** panel in GenLayer Studio.

---

## 7. Testing Contract Code

Contract unit and integration tests are located in `tests/`:

```bash
pytest tests/
# or with network flag:
gltest --network studionet
```

---

## 8. License

MIT License.
