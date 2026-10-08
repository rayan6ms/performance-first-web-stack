# FieldStock foundation and decisions

## Brief and initial scope

Warehouse staff will view stock and record movements; supervisors will reconcile changes. Eventual authenticated actions and validation belong to Rust. Current authorized deliverable: an interactive web shell, public Rust process-health endpoint, discoverable OpenAPI contract, generated browser types and runtime validation. No inventory model, fake stock controls, persistence or identity integration.

English UI. Initial estimate: three warehouses, 30 concurrent staff, possibly 300 later. These are supplied estimates, not benchmark results. Regional hosting near authoritative data is an assumption; provider and region remain undecided. No SEO/public content requirement, load test, queue, uploads, payments, analytics or infrastructure orchestration. No remote provisioning, deployment, production migrations or credentials supplied.

## Selected profile snapshot

Profile: `performance-first-web-stack`. Source package: supplied `inputs/performance-first-web-stack` from kickoff fixture `kickoff-20261008-114725`; revision unknown (source is not a Git checkout). Snapshot date: 2026-10-08. Local core: [stack/AGENTS.md](stack/AGENTS.md); complete references under `stack/references/`, copied byte-for-byte. These local files govern continuation without external installation paths. Unused references do not select their technologies.

## Decisions

### D-001 — Chosen: interactive web and runtime

Profile defaults: SolidJS + SolidStart SSR, Bun tooling and production runtime, supported Vite/Rolldown integration. Native CSS and semantic HTML suffice for one panel; no shared styling compiler or custom widget system is needed. Solid signals manage local state. Valibot validates wire data. No additional cache/state library, Effect, BFF or monorepo orchestrator.

Manual minimal setup follows official SolidStart v2 documentation; no generator/template was invoked. Exact versions are pinned in package.json and bun.lock. TypeScript 5.9.3 satisfies openapi-typescript 7's `^5.x` peer range; selecting TypeScript 7 would violate that range. Nitro 3.0.260903-beta is the official v2 portable deployment integration currently available, pinned with the `bun` preset. Its prerelease status is an adapter risk to validate locally and review before production release; it does not change framework or runtime ownership.

### D-002 — Chosen: Rust process-health contract

Profile defaults and explicit user path preference: Axum/Tokio/Tower owns API behavior; browser calls Rust directly. Public GET `/health` returns only `{ "status": "ok" }`; GET `/openapi.json` exposes the same utoipa-generated specification exported to [openapi.json](openapi.json). Neither endpoint represents data/auth/dependency readiness. Browser uses generated types + openapi-fetch and strict Valibot validation, no-store, omitted credentials, a three-second deadline, and explicit unavailable/retry behavior. Rust uses a two-second response deadline, 32 concurrent admitted requests with shedding, two Tokio workers, no request body/domain operations and graceful SIGINT/SIGTERM shutdown. These application limits do not establish production connection/admission capacity.

Local defaults: web `http://127.0.0.1:45105`; Rust `127.0.0.1:45106`. Exact web-origin CORS, GET only, no credentials; CORS is not authentication. Production origin/TLS/network controls await D-005. No Bun forwarding endpoint exists.

### D-003 — Deferred: offline writes and authoritative data ownership

Question: **Must scanners write while disconnected, and is there one central transactional owner or independently synchronized site data?** Deliberately undecided; no records to migrate. Safe provisional behavior: no persistence or stock writes at all. Blocks database/SDK selection and connection, domain schema, migrations and stock-change implementation. Web/Rust tooling and health may proceed. Trigger: before choosing/connecting persistence, creating any domain schema/migration, or implementing stock changes. Next agent must ask the question, establish conflict/consistency/recovery requirements, then read only the selected data profile and affected linked boundaries. Do not silently choose PostgreSQL or Turso or create a substitute abstraction to bypass this decision.

### D-004 — Deferred: identity and resource authorization

Question: **Which identity provider/session model and staff/supervisor permissions across warehouse resources should govern authenticated actions?** No provider/credentials selected. Safe provisional behavior: public/local process-health only; no private data, accounts, session storage, tokens or mutations. Blocks authenticated/private data and stock actions. Trigger: before implementing login, private endpoints or stock mutations. Next agent asks the question, reads the local integrations guidance and designs Rust credential validation and per-resource/warehouse authorization with denial/cross-tenant checks. UI visibility and forwarded IDs grant no permission.

### D-005 — Deferred: deployment provider and region

Question: **Which provider/region, origin/TLS topology and residency requirements apply once data ownership is known?** Regional deployment near data is only an assumption. Safe provisional behavior: local loopback services, no remote provisioning. Blocks production hosting, external service checks and production runtime/security readiness. Local build/start and browser checks may proceed. Trigger: before preparing a concrete release/deployment. Ask the question, resolve D-003 locality implications, review Nitro prerelease support and request new external authorization only if not already supplied.

## Prepared state, commands and checks

The initial web/Rust/health foundation is implemented and verified locally. Files: root package.json/bun.lock, Vite and strict TypeScript configuration, SolidStart route/entrypoints and native CSS, api/Cargo.toml/Cargo.lock and pinned Rust toolchain, Rust health/OpenAPI service, generated TypeScript contract and Valibot/openapi-fetch probe, focused tests, contract-drift and smoke scripts. No future persistence/identity/provider checks apply yet.

Tool versions detected: Bun 1.4.0; existing native Rust/Cargo 1.97.1. The host rustup proxy errors with `unknown proxy name: t3_code_nightly`. No shared toolchain was replaced. This host can use the optional scoped `FIELDSTOCK_RUST_BIN` override documented below; normal installations use the pinned api/rust-toolchain.toml.

All following commands run at the repository root. On this trial host set:

```sh
export FIELDSTOCK_RUST_BIN=/path/to/installed/rust-toolchain/bin
```

The optional override points to existing Rust binaries only. On a working rustup installation omit it. Cargo scripts change directory to `api/` and cap compilation at two jobs. No global overrides are installed.

```sh
bun install --frozen-lockfile
bun run api:check
bun run api:format:check
bun run api:lint
bun run api:test
bun run api:build
bun run contract:generate  # only after intentionally changing the Rust contract
bun run contract:check
bun run typecheck
bun run lint
bun run format:check
bun run test
bun run build
```

Development, in separate terminals:

```sh
bun run api:dev
bun run dev
```

Built SSR, in separate terminals after `bun run api:build` and `bun run build`:

```sh
./api/target/release/fieldstock-api
HOST=127.0.0.1 PORT=45105 bun run start
```

Stop each owned foreground service with Ctrl+C; Rust also handles SIGTERM gracefully. Never kill a process occupying these ports. Choose free alternate ports and align `API_BIND`, `WEB_ORIGIN`, `VITE_API_BASE_URL`, web dev CLI port and production `PORT` instead. `.env.example` documents variable purposes. Vite loads web `.env` at build/dev time; Rust does not load dotenv, so export its variables explicitly. Browser URL is public, never a secret. No credentials needed.

With both services running: `bun run smoke healthy`. Stop only Rust and run `bun run smoke unavailable`; the shell must still respond while the direct probe reports unavailable. Browser checks remain necessary to establish hydration, CORS and interactions. Production builds require rebuilding when `VITE_API_BASE_URL` changes.

## Readiness limits

Initial scope is ready for local continuation. No inventory application, authenticated capability, data synchronization, migration, provider integration or deployed service exists. No measured latency/throughput, field performance or WCAG conformance claims. No stress testing requested. D-003/D-004 are intentional product blockers for dependent future work; they do not block the verified health foundation. D-005 blocks production hosting choices. Nitro's prerelease adapter needs release/support review before deployment. Production TLS, connection-level admission, telemetry/export, operating SLOs, recovery and release controls are not established by this health scaffold; add them when preparing a real service release using the operations guidance.

## Verification record — 2026-10-08

Tested file state: the initial foundation committed with this record; no application code changed after the final checks. Runtime: local Linux, Bun 1.4.0, Rust/Cargo 1.97.1 through the scoped existing-binary override, two Cargo jobs/Tokio workers and two frontend bundler/linter/formatter threads. Native Rust release executable and actual Nitro `bun` production artifact were exercised. No containers, remote accounts or external provisioning were needed.

- **Passed installation:** `bun install --network-concurrency 2`, then `bun install --frozen-lockfile --network-concurrency 2` (no changes); initial Cargo build created Cargo.lock, subsequent checks and release build used `--locked`.
- **Passed frontend:** `bun run typecheck` (strict, separate from transpilation), `bun run lint`, `bun run format:check`, `bun run test` (two tests/five assertions reject unexpected fields/status, malformed JSON, non-2xx and aborted requests). Oxlint's file-debug check confirmed nine authored TS/TSX/config files covered. Generated declarations use type/drift checks, not lint. Oxfmt checks TS/TSX, CSS and explicit JSON configuration; Rust uses rustfmt. Markdown/shell/TOML have manual/link review, not JS lint coverage. TypeScript `skipLibCheck` applies to third-party declaration internals; strict authored checks remain enabled.
- **Passed Rust:** `bun run api:check`, `bun run api:format:check`, `bun run api:lint` (clippy all-targets with warnings denied), `bun run api:test` (one real-router contract/origin/GET-only test), `bun run api:build` (optimized release, locked). Health contains only the declared status; no business/private data.
- **Passed contract:** `bun run contract:generate` exported utoipa's specification and generated browser declarations; `bun run contract:check` verified Rust → committed OpenAPI → formatted generated TypeScript with no drift. `bun run smoke healthy` also compared live `/openapi.json` with the committed specification, checked allowed-origin CORS and no-store.
- **Passed production build/start:** `bun run build` produced `.output/server/index.mjs` with the explicit Bun preset. `HOST=127.0.0.1 PORT=45105 bun run start` served the SSR page and its JS/CSS assets; `./api/target/release/fieldstock-api` served real health. Build emitted one upstream code-splitting debug-name warning; artifacts/startup passed. Vite's generic preview hint was not used as runtime proof.
- **Passed real browser:** T3 collaborative Chromium preview inspected built output at 1280×800 and 375×812. Healthy response came directly from `127.0.0.1:45106/health` with HTTP 200; the Bun server did not forward it. Tab focused “Check again”, a visible 3px outline appeared, Enter initiated a new request, and narrow layout had no horizontal overflow. Live region/state labels remained visible. This is scoped manual accessibility evidence, not a conformance audit.
- **Passed failure/recovery:** with Rust stopped, `bun run smoke unavailable` passed while the built shell still rendered its real heading. Browser retry displayed “Rust service unavailable” and recovery advice; the network showed the expected connection refusal. Restarting the same real Rust release service and clicking retry restored healthy with a fresh request. No mock was used for integration readiness; the isolated test server only supplies malformed wire fixtures.
- **Passed development:** `bun run dev` started Vite on the strict local port; HTTP smoke and a hydrated browser page showed healthy against the same release API.
- **Fixed then rechecked:** initial minimal router lost visible content on hydration despite successful SSR. Added a Suspense boundary around lazy route children, rebuilt and restarted actual Bun output, reran separate types/lint/format and the browser/HTTP sequence. Smoke now checks rendered page content instead of merely the title/HTTP 200.
- **Passed handoff:** every local Markdown link resolves; copied core and complete references match the selected source byte-for-byte; manifests match documented commands; no placeholders, secrets or unused domain integrations were added.
- **Stopped and confirmed:** all owned Rust, Bun production and Vite development processes exited; `ss -ltnp '( sport = :45105 or sport = :45106 )'` showed no listeners. The task-owned preview tab was closed. No unrelated processes or shared runtimes were changed.

No required initial-scope check remains failed or blocked. Authentication/persistence integration, deployment, workload/load, field performance, telemetry and recovery checks were not run because those capabilities are not selected/implemented or authorized yet. Before dependent implementation, resolve the specific questions and triggers in D-003 through D-005 without rerunning settled kickoff choices.

## Official setup evidence

Consulted matching official guidance and installed types/source on 2026-10-08:

- [SolidStart v2 getting started](https://docs.solidjs.com/solid-start/v2/getting-started), [deployment plugins](https://docs.solidjs.com/solid-start/v2/guides/deployment-plugins), [routing](https://docs.solidjs.com/solid-start/v2/building-your-application/routing), and app/client/server entrypoint references. The docs' Node compatibility metadata alone did not establish Bun unsuitability; actual Bun build/start/hydration were verified.
- [Nitro Bun runtime](https://nitro.build/deploy/runtimes/bun) and installed Nitro/SolidStart configuration types established the Bun preset and production entrypoint.
- [Axum 0.8.9](https://docs.rs/axum/0.8.9/axum/) and [utoipa 6](https://docs.rs/utoipa/6.0.0/utoipa/) plus compiler-checked Tower/Tokio APIs established the native HTTP/OpenAPI setup.
- [openapi-typescript 7 CLI](https://openapi-ts.dev/cli) plus registry peer metadata established generation and the compatible TypeScript 5 choice. [Oxlint usage](https://oxc.rs/docs/guide/usage/linter.html) and installed Oxlint/Oxfmt CLI help established exact flags/file coverage.

All direct JS dependencies are exact-pinned in package.json with transitive resolution in bun.lock; all direct Rust dependencies are exact-pinned in api/Cargo.toml with transitive resolution in api/Cargo.lock. No broad upgrades or global toolchain replacement occurred.
