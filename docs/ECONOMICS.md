# Protocol Economics & Fee Model — Faux

## 1. Overview
Faux aligns community financial incentives with truthful media adjudication.

- **Staking Escrow:** Community members deposit native GEN tokens into `FauxTreasury`.
- **Prorata Reward Distribution:** Winning stakers split 98% of the total escrow pool (their original stake + share of losing stakes).
- **Protocol Reserve Fee:** 2% of the total case pool is collected into `FauxTreasury.protocol_fees_collected`.

---

## 2. Payout Formula

Let:
- \(S_{user}\) = Stake deposited by winning participant
- \(P_{win}\) = Total stake deposited on winning side (`total_fake` or `total_real`)
- \(P_{total}\) = Total pool deposited across both sides (`total_fake + total_real`)
- \(D\) = Distributable pool after 2% fee = \(\lfloor P_{total} \times 0.98 \rfloor\)

The payout \(R\) returned to the winning participant is:
\[ R = \left\lfloor \frac{S_{user} \times D}{P_{win}} \right\rfloor \]

### Edge Cases & Solvency Guards:
- If \(P_{win} = 0\) (no winning stakers) or \(D = 0\): \(R = S_{user}\) (100% refund).
- If verdict is `INCONCLUSIVE` or confidence \(< 60\): 100% refund of initial stakes.
