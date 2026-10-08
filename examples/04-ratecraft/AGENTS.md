# RateCraft — project instructions

Read [the local performance-first profile](docs/stack/AGENTS.md) before changing the foundation, then load only its task-relevant references. Read [the decision record](docs/stack-decisions.md) for product scope, choices, deferred triggers, commands, and actual verification state. These local files are sufficient for continuation; kickoff need not be rerun.

Keep applicable profile defaults and accepted project choices. Ordinary feature requests do not authorize stack replacement, migrations, remote provisioning, publishing, or production changes. Reopen only an affected boundary when requirements change or evidence warrants it; record the basis, tradeoff, and validation in the decision record.

When work reaches a deferred decision's trigger or blocked scope, ask its recorded question before dependent implementation. Continue independent authorized work. Resolve that entry under its existing ID; preserve superseded decisions rather than creating competing plans.

Use Bun for JavaScript/TypeScript; pnpm only if unsuitable, then npm only if both are unsuitable. Use rootless Podman before Docker when containers are needed; prefer uv for Python. Keep build/test concurrency modest (two workers where supported). Never terminate T3 Code or unrelated processes, replace shared runtimes, perform host-wide cleanup, run stress tests, or exhaust system resources. Stop only task-owned services after verification.

Initial scope: a public English homepage and browser-local hourly estimate from positive finite income and hours. No backend domain service, identity, storage, payment, or speculative PDF integration. Dollars are a display unit. Keep input out of URLs, logs, and server requests. Native labeled controls suffice for the current UI; preserve keyboard use, readable validation, responsive layout, and input recovery.

Maintain strict type checking separately from lint/transpilation. Update actual setup/check state in the decision record when commands or boundaries change. Never describe selected tools, a dev server, or a passing build as verified production operations.
