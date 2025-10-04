# Safety Notes

- The application is **safe by default**. Vulnerabilities require `VULN_MODE=on` and only run in Docker.
- Do **not** expose the app publicly with `VULN_MODE=on`.
- PoC targets `http://localhost` only.
- No real data. In‑memory SQLite is used for demo.