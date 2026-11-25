#!/usr/bin/env python3
"""
tools/capture_scroll_animations.py - Python Orchestrator for ASUS ROG Runtime Animation Hooks

Runs the 4 deep runtime hooks:
 1. Canvas Frame Sequence Interceptor (<canvas> drawImage hook)
 2. Web Animations API Extractor (cubic-bezier, timings, keyframes)
 3. Scroll-Keyframe Sampling (0% -> 100% in 2% steps)
 4. Retina 2K/4K CDN Asset & Video Interceptor (deviceScaleFactor: 2)
"""

import os
import sys
import argparse
import subprocess
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
FRONTEND_DIR = PROJECT_ROOT / "frontend"
OUTPUT_DIR = PROJECT_ROOT / "assets" / "animation-capture"

def main():
    parser = argparse.ArgumentParser(description="ASUS ROG Deep Animation & Media Capture Engine")
    parser.add_argument("--url", default="https://rog.asus.com/vn/", help="Target ROG page URL")
    parser.add_argument("--output", default=str(OUTPUT_DIR), help="Output directory")
    parser.add_argument("--sample-step", type=int, default=2, help="Scroll sample step percentage (default: 2)")

    args = parser.parse_args()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    script_path = FRONTEND_DIR / "scripts" / "capture-scroll-animations.mjs"
    cmd = [
        "node",
        str(script_path),
        "--url", args.url,
        "--output", str(args.output),
        "--sample-step", str(args.sample_step)
    ]

    print(f"🚀 Launching Runtime Animation & Media Hook Engine for: {args.url}...")
    res = subprocess.run(cmd, cwd=str(FRONTEND_DIR))
    sys.exit(res.returncode)

if __name__ == "__main__":
    main()
