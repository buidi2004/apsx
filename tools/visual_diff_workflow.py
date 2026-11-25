#!/usr/bin/env python3
"""
tools/visual_diff_workflow.py - Automated Visual Diff & Pixel-Perfect Parity Loop

Orchestrates the 4-phase visual verification loop:
 1. Freeze Animations (injects global paused CSS into browser contexts)
 2. Multi-Viewport & Section Capture (Playwright / Chrome DevTools)
 3. Pixelmatch / SSIM Diff Highlight (tô đỏ lệch vị trí/sai màu với #FF0036)
 4. Auto-Patch Style Suggestions (extracts getBoundingClientRect & getComputedStyle)
"""

import os
import sys
import json
import argparse
import subprocess
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
FRONTEND_DIR = PROJECT_ROOT / "frontend"
DIFF_REPORTS_DIR = PROJECT_ROOT / "diff-reports"

def run_visual_diff(remote_url, local_url, viewports, sections, threshold):
    print("=" * 70)
    print(" 🚀 ASUS ROG PIXEL-PERFECT VISUAL DIFF ORCHESTRATOR")
    print("=" * 70)
    print(f" Baseline (Remote):  {remote_url}")
    print(f" Target (Local):     {local_url}")
    print(f" Viewports:          {','.join(viewports)}")
    print(f" Sections:           {','.join(sections)}")
    print(f" Diff Threshold:     {threshold}")
    print(f" Reports Output:     {DIFF_REPORTS_DIR}")
    print("-" * 70)

    DIFF_REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    script_path = FRONTEND_DIR / "scripts" / "visual-diff-loop.mjs"
    cmd = [
        "node",
        str(script_path),
        "--remote", remote_url,
        "--local", local_url,
        "--viewports", ",".join(viewports),
        "--sections", ",".join(sections),
        "--output", str(DIFF_REPORTS_DIR),
        "--threshold", str(threshold)
    ]

    print(f"Executing: {' '.join(cmd)}\n")
    res = subprocess.run(cmd, cwd=str(FRONTEND_DIR), text=True)

    report_json = DIFF_REPORTS_DIR / "report.json"
    if report_json.exists():
        with open(report_json, "r", encoding="utf-8") as f:
            data = json.load(f)
        score = data.get("overallAccuracy", 0)
        recs = data.get("recommendations", [])

        print("\n" + "=" * 70)
        print(f" 🎯 PARITY SCORE: {score}%")
        print("=" * 70)
        if score >= 98.0:
            print(" ✅ PIXEL-PERFECT AUDIT PASSED! (>= 98% visual & structural parity)")
        else:
            print(f" ⚠️ Parity is at {score}%. Review actionable auto-patch suggestions:")
            for i, r in enumerate(recs[:10], 1):
                print(f"   {i}. [{r.get('target')}]: {r.get('action')}")
            if len(recs) > 10:
                print(f"   ... and {len(recs) - 10} more suggestions in diff-reports/REPORT.md")
    else:
        print("⚠️ Warning: report.json was not generated.")

    return res.returncode

def main():
    parser = argparse.ArgumentParser(description="ASUS ROG Visual Diff Parity Loop")
    parser.add_argument("--remote", default="https://rog.asus.com/vn/", help="Remote baseline URL")
    parser.add_argument("--local", default="http://localhost:3000/vn", help="Local clone URL")
    parser.add_argument("--viewports", default="desktop-wide,laptop,mobile", help="Comma-separated viewports")
    parser.add_argument("--sections", default="navbar,subbar,hero,matrix,specs,footer", help="Comma-separated sections")
    parser.add_argument("--threshold", type=float, default=0.1, help="Pixelmatch sensitivity")

    args = parser.parse_args()
    viewports = [v.strip() for v in args.viewports.split(",") if v.strip()]
    sections = [s.strip() for s in args.sections.split(",") if s.strip()]

    code = run_visual_diff(args.remote, args.local, viewports, sections, args.threshold)
    sys.exit(code)

if __name__ == "__main__":
    main()
