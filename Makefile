.PHONY: up up-vuln down sast poc poc-safe

up:
	docker compose up -d --build app

up-vuln:
	docker compose up -d --build app-vuln

down:
	docker compose down

sast:
	docker compose exec app npm run sast:semgrep || true && \
	docker compose exec app npm run audit || true

poc:
	cd poctools && go run sqli_poc.go -target http://localhost:3001 || true

poc-safe:
	cd poctools && go run sqli_poc.go -target http://localhost:3000 || true
