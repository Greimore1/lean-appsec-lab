# lean-appsec-lab

A **minimal**, **safe-by-default** AppSec lab showing an example end‑to‑end workflow

1) Detect (SAST: Semgrep + npm audit)
2) Reproduce locally (Go PoC)
3) Fix (safe code path is default)
4) Prove (regression check in CI — PoC fails against the safe build)

> Safety: `VULN_MODE` is **off by default**. The vulnerable path is only for local demos and requires `VULN_MODE=on` in Docker.

## Quick start
```bash
make up           # safe app on http://localhost:3000
make up-vuln      # vulnerable demo on http://localhost:3001 (local only)
make poc          # run PoC vs vulnerable app (expects success)
make poc-safe     # run PoC vs safe app (expects failure)
make sast         # run Semgrep + npm audit locally
make down         # stop containers
```

## Why this exists
- Show practical AppSec workflow without production risk.
- Demonstrate collaboration habits with a relatively small, reviewable codebase.

## What to look at
- `src/app.js` — login endpoint has a **safe** code path by default and a toggleable **vulnerable** path for learning.
- `poctools/sqli_poc.go` — local SQLi demo tool.
- `.github/workflows/ci.yml` — single workflow: SAST + regression PoC against safe app.
- `threat-model/DFD.md` — 1‑page DFD + STRIDE table.
- `SAFE-NOTES.md` — explicit risk controls.

