import json
import os
import sys

def main():
    print("=== GenLayer Studionet Deployment Script for Faux ===")
    print("Deployment Order:")
    print("1. contracts/faux_treasury.py")
    print("2. contracts/faux_reputation.py")
    print("3. contracts/faux_core.py")
    print("4. Core.set_dependencies(treasury_address, reputation_address)")
    print("\nNote: On GenLayer Studio, deploy these files via the 'Run & Debug' panel.")
    print("After deployment, update 'scripts/deploy/deployed_addresses.json' and 'frontend/.env'.")

if __name__ == "__main__":
    main()
