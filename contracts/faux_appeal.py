# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
from dataclasses import dataclass

def _addr_str(addr: Address) -> str:
    try:
        return addr.as_hex.lower()
    except Exception:
        return str(addr).lower()

@allow_storage
@dataclass
class AppealRecord:
    appeal_id: str
    case_id: str
    appellant: str
    stake: bigint
    status: str
    created_at: u64
    new_evidence_url: str
    appeal_reason: str

class Contract(gl.Contract):
    owner: Address
    core_address: Address
    appeals: TreeMap[str, AppealRecord]
    case_appeals: TreeMap[str, str]

    def __init__(self):
        self.owner = gl.message.sender_address
        self.core_address = gl.message.sender_address

    @gl.public.write
    def set_core(self, core: Address) -> None:
        if gl.message.sender_address != self.owner:
            raise UserError("only owner can set core address")
        self.core_address = core

    @gl.public.write.payable
    def file_appeal(self, case_id: str, new_evidence_url: str, appeal_reason: str) -> str:
        if gl.message.value == bigint(0):
            raise UserError("appeal stake must be > 0")
        if case_id in self.case_appeals:
            raise UserError("case has already been appealed")

        appellant_str = _addr_str(gl.message.sender_address)
        appeal_id = f"appeal-{case_id}"

        record = AppealRecord(
            appeal_id=appeal_id,
            case_id=case_id,
            appellant=appellant_str,
            stake=gl.message.value,
            status="OPEN",
            created_at=u64(0),
            new_evidence_url=new_evidence_url,
            appeal_reason=appeal_reason
        )

        self.appeals[appeal_id] = record
        self.case_appeals[case_id] = appeal_id
        return appeal_id

    @gl.public.write
    def resolve_appeal(self, case_id: str, is_overturned: bool) -> None:
        if gl.message.sender_address != self.core_address:
            raise UserError("only core contract can resolve appeal")
        if case_id not in self.case_appeals:
            raise UserError("no appeal found for this case")

        appeal_id = self.case_appeals[case_id]
        rec = self.appeals[appeal_id]
        new_status = "OVERTURNED" if is_overturned else "UPHELD"

        self.appeals[appeal_id] = AppealRecord(
            appeal_id=rec.appeal_id,
            case_id=rec.case_id,
            appellant=rec.appellant,
            stake=rec.stake,
            status=new_status,
            created_at=rec.created_at,
            new_evidence_url=rec.new_evidence_url,
            appeal_reason=rec.appeal_reason
        )

    @gl.public.view
    def get_appeal(self, case_id: str) -> dict:
        if case_id not in self.case_appeals:
            return {}
        appeal_id = self.case_appeals[case_id]
        rec = self.appeals[appeal_id]
        return {
            "appeal_id": rec.appeal_id,
            "case_id": rec.case_id,
            "appellant": rec.appellant,
            "stake": int(rec.stake),
            "status": rec.status,
            "created_at": int(rec.created_at),
            "new_evidence_url": rec.new_evidence_url,
            "appeal_reason": rec.appeal_reason
        }
