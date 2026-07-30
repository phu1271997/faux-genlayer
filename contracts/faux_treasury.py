# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *

class Contract(gl.Contract):
    owner: Address
    core_address: Address
    case_balances: TreeMap[str, bigint]
    protocol_fees_collected: bigint

    def __init__(self):
        self.owner = gl.message.sender
        self.core_address = gl.message.sender
        self.protocol_fees_collected = bigint(0)

    @gl.public.write
    def set_core(self, core: Address) -> None:
        if gl.message.sender != self.owner:
            raise UserError("only owner can set core address")
        self.core_address = core

    @gl.public.write.payable
    def deposit_for_case(self, case_id: str) -> None:
        if gl.message.sender != self.core_address:
            raise UserError("only core contract can deposit for case")
        
        current_bal = self.case_balances.get(case_id, bigint(0))
        self.case_balances[case_id] = current_bal + gl.message.value

    @gl.public.write
    def pay_out(self, case_id: str, recipient: Address, amount: bigint) -> None:
        if gl.message.sender != self.core_address:
            raise UserError("only core contract can trigger payout")
        
        current_bal = self.case_balances.get(case_id, bigint(0))
        if amount > current_bal:
            raise UserError("insufficient balance in case treasury")
        
        self.case_balances[case_id] = current_bal - amount
        gl.get_contract_at(recipient).emit_transfer(value=u256(amount))

    @gl.public.write
    def collect_fee(self, case_id: str, fee_amount: bigint) -> None:
        if gl.message.sender != self.core_address:
            raise UserError("only core contract can collect fee")
        
        current_bal = self.case_balances.get(case_id, bigint(0))
        if fee_amount > current_bal:
            raise UserError("insufficient balance to collect fee")
        
        self.case_balances[case_id] = current_bal - fee_amount
        self.protocol_fees_collected = self.protocol_fees_collected + fee_amount

    @gl.public.view
    def get_case_balance(self, case_id: str) -> bigint:
        return self.case_balances.get(case_id, bigint(0))

    @gl.public.view
    def get_protocol_fees_collected(self) -> bigint:
        return self.protocol_fees_collected
