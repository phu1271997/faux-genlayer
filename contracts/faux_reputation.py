# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
from dataclasses import dataclass

@allow_storage
@dataclass
class StakerStats:
    staker: str
    correct: bigint
    wrong: bigint
    total_cases: bigint
    accuracy_bp: u16
    total_staked: bigint

class Contract(gl.Contract):
    owner: Address
    core_address: Address
    stats: TreeMap[str, StakerStats]
    registered_stakers: DynArray[str]

    def __init__(self):
        self.owner = gl.message.sender_address
        self.core_address = gl.message.sender_address

    @gl.public.write
    def set_core(self, core: Address) -> None:
        if gl.message.sender_address != self.owner:
            raise UserError("only owner can set core address")
        self.core_address = core

    @gl.public.write
    def record_outcome(self, staker: str, was_correct: bool, stake_amount: bigint) -> None:
        if gl.message.sender_address != self.core_address:
            raise UserError("only core contract can record outcome")
        
        is_new = staker not in self.stats
        if is_new:
            self.registered_stakers.append(staker)
            current = StakerStats(
                staker=staker,
                correct=bigint(0),
                wrong=bigint(0),
                total_cases=bigint(0),
                accuracy_bp=u16(0),
                total_staked=bigint(0)
            )
        else:
            current = self.stats[staker]
        
        new_correct = current.correct + (bigint(1) if was_correct else bigint(0))
        new_wrong = current.wrong + (bigint(0) if was_correct else bigint(1))
        new_total_cases = current.total_cases + bigint(1)
        new_total_staked = current.total_staked + stake_amount
        
        # Calculate accuracy in basis points (0..10000)
        acc_int = (int(new_correct) * 10000) // int(new_total_cases)
        new_acc_bp = u16(acc_int)

        self.stats[staker] = StakerStats(
            staker=staker,
            correct=new_correct,
            wrong=new_wrong,
            total_cases=new_total_cases,
            accuracy_bp=new_acc_bp,
            total_staked=new_total_staked
        )

    @gl.public.view
    def get_stats(self, staker: str) -> dict:
        if staker not in self.stats:
            return {
                "staker": staker,
                "correct": 0,
                "wrong": 0,
                "total_cases": 0,
                "accuracy_bp": 0,
                "total_staked": 0
            }
        s = self.stats[staker]
        return {
            "staker": s.staker,
            "correct": int(s.correct),
            "wrong": int(s.wrong),
            "total_cases": int(s.total_cases),
            "accuracy_bp": int(s.accuracy_bp),
            "total_staked": int(s.total_staked)
        }

    @gl.public.view
    def get_staker_count(self) -> u32:
        return u32(len(self.registered_stakers))
