"""
VendorPulse - Root System Orchestrator & Launcher
ModelX 2.0 | Team Nexio | IEEE CIS Student Chapter, IIT
"""

import os
import sys
import time
import subprocess
import webbrowser
from dotenv import load_dotenv

load_dotenv()

def print_banner():
    banner = r"""
 __      __           _             _____       _           
 \ \    / /          | |           |  __ \     | |          
  \ \  / /__ _ __  __| | ___  _ __ | |__) |   _| |___  ___  
   \ \/ / _ \ '_ \/ _` |/ _ \| '__||  ___/ | | | / __|/ _ \ 
    \  /  __/ | | | (_| | (_) | |   | |   | |_| | \__ \  __/ 
     \/ \___|_| |_|\__,_|\___/|_|   |_|    \__,_|_|___/\___| 
    
    ModelX 2.0 — Predictive Early-Warning Intelligence Platform
    Author: Sahas Abeygunarathne | Team Nexio | IEEE CIS IIT
    ==========================================================
    """
    print(banner)

def run_tests():
    print("[1/3] Running Backend Verification Tests...")
    cmd = [sys.executable, "-m", "backend.tests.test_api"]
    res = subprocess.run(cmd)
    if res.returncode != 0:
        print("[!] Backend verification encountered an issue.")
    else:
        print("[+] Backend test suite PASSED cleanly.")

def run_benchmarks():
    print("\n[2/3] Checking ML Model Benchmarks vs Baselines...")
    cmd = [sys.executable, "-m", "ml_engine.evaluation.evaluate_models"]
    subprocess.run(cmd)

def start_backend():
    print("\n[3/3] Starting FastAPI Live Backend Server on http://localhost:8000 ...")
    print("      API Docs available at: http://localhost:8000/docs")
    print("      Interactive Frontend located in ./frontend (run 'npm run dev' to preview)")
    print("      Press Ctrl+C to terminate the server.\n")

    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    print_banner()
    if len(sys.argv) > 1 and sys.argv[1] == "--test-only":
        run_tests()
        run_benchmarks()
    else:
        start_backend()
