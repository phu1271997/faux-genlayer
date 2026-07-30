# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
from dataclasses import dataclass

def _addr_str(addr: Address) -> str:
    try:
        return addr.as_hex
    except Exception:
        return str(addr)

@allow_storage
@dataclass
class Case:
    id: str
    submitter: str
    media_url: str
    description: str
    context_urls: DynArray[str]
    initial_side: str
    created_at: u64
    deadline: u64
    status: str
    verdict: str
    verdict_side: str
    confidence: u8
    reason: str
    total_fake: bigint
    total_real: bigint

@allow_storage
@dataclass
class StakeRecord:
    staker: str
    side: str
    amount: bigint
    claimed: bool

@gl.contract_interface
class ITreasury:
    def deposit_for_case(self, case_id: str) -> None: ...
    def pay_out(self, case_id: str, recipient: Address, amount: bigint) -> None: ...
    def collect_fee(self, case_id: str, fee_amount: bigint) -> None: ...

@gl.contract_interface
class IReputation:
    def record_outcome(self, staker: str, was_correct: bool, stake_amount: bigint) -> None: ...

class Contract(gl.Contract):
    owner: Address
    treasury_address: Address
    reputation_address: Address
    case_counter: bigint
    cases: TreeMap[str, Case]
    case_ids: DynArray[str]
    stakes: TreeMap[str, StakeRecord]
    case_stakers: TreeMap[str, DynArray[str]]

    def __init__(self):
        self.owner = gl.message.sender
        self.treasury_address = gl.message.sender
        self.reputation_address = gl.message.sender
        self.case_counter = bigint(0)

    @gl.public.write
    def set_dependencies(self, treasury: Address, reputation: Address) -> None:
        if gl.message.sender != self.owner:
            raise UserError("only owner can set dependencies")
        self.treasury_address = treasury
        self.reputation_address = reputation

    @gl.public.write.payable
    def create_case(
        self,
        media_url: str,
        description: str,
        context_urls: DynArray[str],
        initial_side: str,
        window_seconds: u64
    ) -> str:
        if initial_side not in ("CLAIM_FAKE", "CLAIM_REAL"):
            raise UserError("invalid initial side; must be CLAIM_FAKE or CLAIM_REAL")
        if gl.message.value == bigint(0):
            raise UserError("initial stake must be > 0")
        if len(context_urls) > 5:
            raise UserError("maximum 5 context URLs allowed")
        if window_seconds < u64(300) or window_seconds > u64(604800):
            raise UserError("window_seconds must be between 300 (5 min) and 604800 (7 days)")

        self.case_counter = self.case_counter + bigint(1)
        case_id = f"case-{int(self.case_counter)}"
        submitter_str = _addr_str(gl.message.sender)
        now_ts = u64(0)  # GenVM runtime environment auto-provides timestamp where needed

        total_fake = gl.message.value if initial_side == "CLAIM_FAKE" else bigint(0)
        total_real = gl.message.value if initial_side == "CLAIM_REAL" else bigint(0)

        new_case = Case(
            id=case_id,
            submitter=submitter_str,
            media_url=media_url,
            description=description,
            context_urls=context_urls,
            initial_side=initial_side,
            created_at=now_ts,
            deadline=now_ts + window_seconds,
            status="OPEN",
            verdict="",
            verdict_side="",
            confidence=u8(0),
            reason="",
            total_fake=total_fake,
            total_real=total_real
        )

        self.cases[case_id] = new_case
        self.case_ids.append(case_id)

        stake_key = f"{case_id}:{submitter_str}"
        self.stakes[stake_key] = StakeRecord(
            staker=submitter_str,
            side=initial_side,
            amount=gl.message.value,
            claimed=False
        )

        stakers_list = gl.storage.inmem_allocate(DynArray[str])
        stakers_list.append(submitter_str)
        self.case_stakers[case_id] = stakers_list

        # Forward deposit to treasury
        ITreasury(self.treasury_address).deposit_for_case(case_id, value=gl.message.value)
        return case_id

    @gl.public.write.payable
    def stake(self, case_id: str, side: str) -> None:
        if case_id not in self.cases:
            raise UserError("case not found")
        
        c = self.cases[case_id]
        if c.status != "OPEN":
            raise UserError("case is not open for staking")
        if side not in ("CLAIM_FAKE", "CLAIM_REAL"):
            raise UserError("invalid side; must be CLAIM_FAKE or CLAIM_REAL")
        if gl.message.value == bigint(0):
            raise UserError("stake amount must be > 0")

        staker_str = _addr_str(gl.message.sender)
        stake_key = f"{case_id}:{staker_str}"

        if stake_key in self.stakes:
            existing = self.stakes[stake_key]
            if existing.side != side:
                raise UserError("cannot stake on both sides of the same case")
            new_amount = existing.amount + gl.message.value
            self.stakes[stake_key] = StakeRecord(
                staker=staker_str,
                side=side,
                amount=new_amount,
                claimed=False
            )
        else:
            self.stakes[stake_key] = StakeRecord(
                staker=staker_str,
                side=side,
                amount=gl.message.value,
                claimed=False
            )
            self.case_stakers[case_id].append(staker_str)

        new_total_fake = c.total_fake + (gl.message.value if side == "CLAIM_FAKE" else bigint(0))
        new_total_real = c.total_real + (gl.message.value if side == "CLAIM_REAL" else bigint(0))

        self.cases[case_id] = Case(
            id=c.id,
            submitter=c.submitter,
            media_url=c.media_url,
            description=c.description,
            context_urls=c.context_urls,
            initial_side=c.initial_side,
            created_at=c.created_at,
            deadline=c.deadline,
            status=c.status,
            verdict=c.verdict,
            verdict_side=c.verdict_side,
            confidence=c.confidence,
            reason=c.reason,
            total_fake=new_total_fake,
            total_real=new_total_real
        )

        ITreasury(self.treasury_address).deposit_for_case(case_id, value=gl.message.value)

    @gl.public.write
    def adjudicate(self, case_id: str) -> None:
        if case_id not in self.cases:
            raise UserError("case not found")
        
        c = self.cases[case_id]
        if c.status != "OPEN":
            raise UserError("case is not open for adjudication")

        media_url = c.media_url
        description = c.description
        context_urls_list = [url for url in c.context_urls]

        def leader_fn():
            evidence_snippets = []
            try:
                media_page = gl.nondet.web.render(media_url, mode='text')[:4000]
                evidence_snippets.append(f"[SOURCE_MEDIA_PAGE]\n{media_page}")
            except Exception as e:
                evidence_snippets.append(f"[SOURCE_MEDIA_PAGE_FETCH_FAIL] {str(e)[:200]}")

            for i, url in enumerate(context_urls_list[:3]):
                try:
                    page = gl.nondet.web.render(url, mode='text')[:3000]
                    evidence_snippets.append(f"[SOURCE_CONTEXT_{i}]\n{page}")
                except Exception as e:
                    evidence_snippets.append(f"[SOURCE_CONTEXT_{i}_FETCH_FAIL]")

            evidence = "\n\n".join(evidence_snippets)

            prompt = f"""You are a forensic media analyst evaluating a claim that a piece of media is a deepfake or manipulated content.

USER'S DESCRIPTION OF THE CLAIM:
{description}

EVIDENCE COLLECTED FROM {len(evidence_snippets)} INDEPENDENT WEB SOURCES:
{evidence}

TASK: Weigh the evidence rigorously. Consider:
- Do reputable sources (news, fact-checkers) report this event as real, or debunk it as fake?
- Are there descriptive signs of AI generation (uncanny artifacts, hallmarks of diffusion models)?
- Does the source page metadata corroborate or contradict the claim?
- Is there evidence the media has been altered or generated?
- If evidence is thin, contradictory, or missing -> prefer INCONCLUSIVE over guessing.

RESPOND WITH VALID JSON ONLY, NO PREAMBLE:
{{"verdict": "FAKE" | "REAL" | "INCONCLUSIVE", "confidence": <integer 0-100>, "reason": "<2-4 sentence justification citing which sources led to the verdict>"}}"""

            return gl.nondet.exec_prompt(prompt, response_format='json')

        def validator_fn(leader_res) -> bool:
            if not isinstance(leader_res, gl.vm.Return):
                return False
            
            leader = leader_res.calldata
            if not isinstance(leader, dict):
                return False
            if 'verdict' not in leader or 'confidence' not in leader:
                return False
            if leader['verdict'] not in ('FAKE', 'REAL', 'INCONCLUSIVE'):
                return False

            mine = leader_fn()
            if not isinstance(mine, dict) or 'verdict' not in mine or 'confidence' not in mine:
                return False

            if mine['verdict'] != leader['verdict']:
                return False

            lc = int(leader.get('confidence', 0))
            mc = int(mine.get('confidence', 0))
            if abs(lc - mc) > 15:
                return False

            return True

        res = gl.vm.run_nondet(leader_fn, validator_fn)

        verdict = str(res.get('verdict', 'INCONCLUSIVE'))
        confidence_val = int(res.get('confidence', 0))
        if confidence_val < 0:
            confidence_val = 0
        if confidence_val > 100:
            confidence_val = 100
        confidence = u8(confidence_val)
        reason = str(res.get('reason', 'No reasoning provided.'))[:500]

        CONFIDENCE_THRESHOLD = 60
        if confidence_val < CONFIDENCE_THRESHOLD or verdict == 'INCONCLUSIVE' or verdict not in ('FAKE', 'REAL'):
            self._resolve_case_refunded(case_id, verdict, confidence, reason)
        else:
            verdict_side = "CLAIM_FAKE" if verdict == "FAKE" else "CLAIM_REAL"
            self._resolve_case_settled(case_id, verdict, verdict_side, confidence, reason)

    def _resolve_case_refunded(self, case_id: str, verdict: str, confidence: u8, reason: str) -> None:
        c = self.cases[case_id]
        self.cases[case_id] = Case(
            id=c.id,
            submitter=c.submitter,
            media_url=c.media_url,
            description=c.description,
            context_urls=c.context_urls,
            initial_side=c.initial_side,
            created_at=c.created_at,
            deadline=c.deadline,
            status="REFUNDED",
            verdict=verdict,
            verdict_side="NONE",
            confidence=confidence,
            reason=reason,
            total_fake=c.total_fake,
            total_real=c.total_real
        )

    def _resolve_case_settled(self, case_id: str, verdict: str, verdict_side: str, confidence: u8, reason: str) -> None:
        c = self.cases[case_id]
        
        # Deduct 2% protocol fee
        total_pool = c.total_fake + c.total_real
        fee_amount = (total_pool * bigint(200)) // bigint(10000)
        
        if fee_amount > bigint(0):
            ITreasury(self.treasury_address).collect_fee(case_id, fee_amount)

        self.cases[case_id] = Case(
            id=c.id,
            submitter=c.submitter,
            media_url=c.media_url,
            description=c.description,
            context_urls=c.context_urls,
            initial_side=c.initial_side,
            created_at=c.created_at,
            deadline=c.deadline,
            status="RESOLVED",
            verdict=verdict,
            verdict_side=verdict_side,
            confidence=confidence,
            reason=reason,
            total_fake=c.total_fake,
            total_real=c.total_real
        )

        # Record reputation for all stakers
        if case_id in self.case_stakers:
            for staker_addr in self.case_stakers[case_id]:
                stake_key = f"{case_id}:{staker_addr}"
                if stake_key in self.stakes:
                    stk = self.stakes[stake_key]
                    was_correct = (stk.side == verdict_side)
                    IReputation(self.reputation_address).record_outcome(
                        staker_addr,
                        was_correct,
                        stk.amount
                    )

    @gl.public.write
    def claim(self, case_id: str) -> None:
        if case_id not in self.cases:
            raise UserError("case not found")
        
        c = self.cases[case_id]
        staker_str = _addr_str(gl.message.sender)
        stake_key = f"{case_id}:{staker_str}"

        if stake_key not in self.stakes:
            raise UserError("no stake found for sender in this case")
        
        stk = self.stakes[stake_key]
        if stk.claimed:
            raise UserError("stake payout already claimed")

        if c.status == "REFUNDED":
            # Refund exact stake amount
            payout_amount = stk.amount
        elif c.status == "RESOLVED":
            if stk.side != c.verdict_side:
                raise UserError("your staked side lost this case")

            winning_pool = c.total_fake if c.verdict_side == "CLAIM_FAKE" else c.total_real
            total_pool = c.total_fake + c.total_real
            distributable_pool = (total_pool * bigint(9800)) // bigint(10000)

            if winning_pool == bigint(0):
                payout_amount = stk.amount
            else:
                payout_amount = (stk.amount * distributable_pool) // winning_pool
        else:
            raise UserError("case is not resolved or refunded yet")

        self.stakes[stake_key] = StakeRecord(
            staker=stk.staker,
            side=stk.side,
            amount=stk.amount,
            claimed=True
        )

        ITreasury(self.treasury_address).pay_out(case_id, gl.message.sender, payout_amount)

    @gl.public.view
    def get_case(self, case_id: str) -> dict:
        if case_id not in self.cases:
            return {}
        c = self.cases[case_id]
        return {
            "id": c.id,
            "submitter": c.submitter,
            "media_url": c.media_url,
            "description": c.description,
            "context_urls": [url for url in c.context_urls],
            "initial_side": c.initial_side,
            "created_at": int(c.created_at),
            "deadline": int(c.deadline),
            "status": c.status,
            "verdict": c.verdict,
            "verdict_side": c.verdict_side,
            "confidence": int(c.confidence),
            "reason": c.reason,
            "total_fake": int(c.total_fake),
            "total_real": int(c.total_real)
        }

    @gl.public.view
    def get_stake(self, case_id: str, staker: str) -> dict:
        stake_key = f"{case_id}:{staker}"
        if stake_key not in self.stakes:
            return {}
        stk = self.stakes[stake_key]
        return {
            "staker": stk.staker,
            "side": stk.side,
            "amount": int(stk.amount),
            "claimed": stk.claimed
        }

    @gl.public.view
    def get_case_count(self) -> u32:
        return u32(len(self.case_ids))
