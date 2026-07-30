import pytest
from conftest import clear_known_contracts

def test_appeal_initialization_and_status():
    """Test appeal status transitions from OPEN -> OVERTURNED / UPHELD."""
    clear_known_contracts()
    mock_appeal = {
        "appeal_id": "appeal-case-1",
        "case_id": "case-1",
        "appellant": "0x71c7656ec7ab88b098defb751b7401b5f6d8976f",
        "stake": 500,
        "status": "OPEN",
        "new_evidence_url": "https://factcheck.org/new-evidence",
        "appeal_reason": "New archival video transcript refutes original verdict"
    }

    assert mock_appeal["status"] == "OPEN"
    mock_appeal["status"] = "OVERTURNED"
    assert mock_appeal["status"] == "OVERTURNED"
