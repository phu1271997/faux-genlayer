import sys
import json
import pytest

def clear_known_contracts():
    """Resets GenLayer SDK global contract registry before deploying new test contracts."""
    for name, module in list(sys.modules.items()):
        if "genlayer" in name and hasattr(module, "__known_contract__"):
            setattr(module, "__known_contract__", None)

@pytest.fixture(autouse=True)
def reset_contract_registry():
    clear_known_contracts()
    yield
    clear_known_contracts()

def install_sim_mocks(client, verdict="FAKE", confidence=85, reason="Mock forensic analysis"):
    """Installs simulator mocks using bare dict params format (Rule #17)."""
    mock_payload = {
        "verdict": verdict,
        "confidence": confidence,
        "reason": reason
    }
    client.provider.make_request(
        method="sim_installMocks",
        params={
            "llm_mocks": {
                ".*": json.dumps(mock_payload)
            },
            "web_mocks": {
                ".*": {"status": 200, "body": "<html><body>Mock media & context evidence page</body></html>"}
            }
        }
    )
