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
class Badge:
    badge_type: str
    name: str
    staker: str
    awarded_at: u64

class Contract(gl.Contract):
    owner: Address
    core_address: Address
    user_badges: TreeMap[str, DynArray[Badge]]

    def __init__(self):
        self.owner = gl.message.sender_address
        self.core_address = gl.message.sender_address

    @gl.public.write
    def set_core(self, core: Address) -> None:
        if gl.message.sender_address != self.owner:
            raise UserError("only owner can set core address")
        self.core_address = core

    @gl.public.write
    def mint_badge(self, staker_addr: str, badge_type: str, name: str) -> None:
        if gl.message.sender_address != self.core_address:
            raise UserError("only core contract can mint badge")

        b = Badge(
            badge_type=badge_type,
            name=name,
            staker=staker_addr,
            awarded_at=u64(0)
        )

        if staker_addr not in self.user_badges:
            badge_list = gl.storage.inmem_allocate(DynArray[Badge])
            badge_list.append(b)
            self.user_badges[staker_addr] = badge_list
        else:
            self.user_badges[staker_addr].append(b)

    @gl.public.view
    def get_user_badges(self, staker_addr: str) -> DynArray[dict]:
        if staker_addr not in self.user_badges:
            return []
        
        result = []
        for b in self.user_badges[staker_addr]:
            result.append({
                "badge_type": b.badge_type,
                "name": b.name,
                "staker": b.staker,
                "awarded_at": int(b.awarded_at)
            })
        return result
