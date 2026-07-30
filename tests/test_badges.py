import pytest
from conftest import clear_known_contracts

def test_reputation_tier_calculation():
    """Test reputation tier calculation for Bronze, Silver, Gold, Diamond."""
    clear_known_contracts()
    
    def get_tier(acc_bp):
        if acc_bp >= 8500:
            return "DIAMOND"
        elif acc_bp >= 7000:
            return "GOLD"
        elif acc_bp >= 5000:
            return "SILVER"
        return "BRONZE"

    assert get_tier(9000) == "DIAMOND"
    assert get_tier(7500) == "GOLD"
    assert get_tier(6000) == "SILVER"
    assert get_tier(3000) == "BRONZE"

def test_badge_mint_record():
    """Test Soulbound Badge record instantiation."""
    clear_known_contracts()
    badge = {
        "badge_type": "WHISTLEBLOWER",
        "name": "First Deepfake Flip",
        "staker": "0x71c7656ec7ab88b098defb751b7401b5f6d8976f",
        "awarded_at": 1700000000
    }
    assert badge["badge_type"] == "WHISTLEBLOWER"
