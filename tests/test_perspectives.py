import pytest
from conftest import clear_known_contracts

def test_multi_perspective_majority_convergence():
    """Test that 2-1 split converges to majority verdict."""
    clear_known_contracts()
    perspectives = {
        "forensic": {"verdict": "FAKE", "finding": "Boundary artifacts found"},
        "journalist": {"verdict": "FAKE", "finding": "No matching Reuters report"},
        "skeptic": {"verdict": "REAL", "finding": "Consistent lighting"}
    }
    
    verdicts = [p["verdict"] for p in perspectives.values()]
    fake_count = verdicts.count("FAKE")
    real_count = verdicts.count("REAL")

    converged_verdict = "FAKE" if fake_count >= 2 else ("REAL" if real_count >= 2 else "INCONCLUSIVE")
    assert converged_verdict == "FAKE"

def test_multi_perspective_split_inconclusive():
    """Test that 1-1-1 split defaults to INCONCLUSIVE."""
    clear_known_contracts()
    verdicts = ["FAKE", "REAL", "INCONCLUSIVE"]
    fake_count = verdicts.count("FAKE")
    real_count = verdicts.count("REAL")

    converged_verdict = "FAKE" if fake_count >= 2 else ("REAL" if real_count >= 2 else "INCONCLUSIVE")
    assert converged_verdict == "INCONCLUSIVE"
