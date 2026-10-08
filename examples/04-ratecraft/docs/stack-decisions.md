# RateCraft — stack decisions

Updated: 2026-10-08. This is the authoritative project record; decision states and implementation states are separate.

## Project brief

Prepare an initial public, shareable English utility for freelancers. Users enter target monthly income and billable hours; positive finite values produce income / hours as an hourly estimate. Provide readable validation, preserved input, labeled controls, keyboard submission, and mobile/desktop layout. Dollars are a displayed unit, not a payment. All calculation runs in the browser, with no permanent storage, identity, authoritative shared state, or server API.

Low initial JavaScript and responsive interaction are priorities. Approximately 100,000 monthly visits and bursts from links are planning estimates, not benchmark or capacity evidence. Mainstream browsers are intended; exact latency budgets and hosting are unmeasured/undecided. The profile's provisional goals are <100 KiB compressed critical-route JavaScript and lab LCP <2 s; field targets are p75 LCP <=2.5 s, INP <=200 ms, CLS <=0.1. No claim of these latency/field outcomes is made.

Setup is locally authorized, including dependency installation and a local commit. No remote provisioning, publishing, paid resources, production migrations, push, credentials, stress tests, global cleanup, or shared-runtime replacement. Only this project and task-owned temporary resources may be modified. Bound build jobs to two where supported and stop task-owned services. Saved estimates and PDF export are future possibilities, not initial requirements.

## Profile snapshot

- Selected package: performance-first-web-stack.
- Source: supplied frozen package at `frozen performance-first-web-stack input (source revision unknown to the original agent)` (provenance only; not a continuation dependency).
- Source revision: unknown; package has no Git revision. Core SHA-256: `e34c55b030f8a643a41162f01b33ad142dfc2b09e75bb6a24403f3ada32e942c`.
- Snapshot date: 2026-10-08.
- Local policy: [core](stack/AGENTS.md), complete unchanged [references](stack/references/). The snapshot includes unused policies for future routing; it does not select their technologies.
- Architecture, tooling, frontend, performance, and operations were read for initial selections and checks.

## Current foundation and minimal scope

SolidJS + SolidStart v2 with supported Vite integration, Bun tooling/application runtime, and Nitro's Bun production preset. Pre-render the public homepage so HTML can be delivered without per-request rendering. Native CSS, Solid signals, native form controls, and Valibot validation. Separate strict TypeScript, Oxlint, Oxfmt, and focused Vitest validation tests. No database, Rust service, BFF, remote client, cache service, queue, containers, media pipeline, or custom UI primitive library is needed now.

Essential files: package manifest/Bun lockfile, framework entries/app, rate validation/calculation and focused tests, Vite/TypeScript/lint/format configuration, ignore rules, README, root instructions, this record, and complete selected policy snapshot. No speculative feature directories, schemas, service integrations, or remote workflows.

## Setup state and commands

Implemented and locally verified: public English homepage, server-rendered/pre-rendered discoverable HTML and metadata, hydrated local calculator, positive finite validation, inline errors and focus recovery, live result updates after submission, and responsive native CSS. No Rust/backend domain service or persistence exists. No external account or environment secret is required.

Manually prepared essential files following the official [SolidStart v2 bare template](https://github.com/solidjs/templates/tree/f217ed37ae4aa518f288b9aa1deb5f10f30c9594/solid-start-v2/bare); source revision `f217ed37ae4aa518f288b9aa1deb5f10f30c9594`. No generator was invoked and no template lockfile or showcase was copied. Dependencies are pinned in [package.json](../package.json), resolved by [bun.lock](../bun.lock). Installed versions: Bun 1.4.0 (`34cbb9a40`), SolidStart 2.0.6, SolidJS 1.9.17, Valibot 1.5.0, Vite 8.3.4, Nitro 3.0.260903-beta, TypeScript 7.0.2, @types/node 24.19.1, Oxlint 1.87.0, Oxfmt 0.72.0, Vitest 5.0.3. Node 24.18.0 was available, but Bun was used for application/build/check execution; no shared runtime was replaced.

Run from the repository root, `.`, with Bun 1.4.0:

```sh
bun install --frozen-lockfile --network-concurrency 2
bun run dev
```

Development binds to `127.0.0.1:43104`, refuses occupied ports, and needs no other service. Stop with Ctrl+C. For a different free port, pass `bun run dev --port 43105`; never displace another listener.

```sh
bun run typecheck
bun run lint
bun run format:check
bun run test
bun run check
bun run build
HOST=127.0.0.1 PORT=43104 bun run start
```

`check` runs the four non-mutating checks sequentially. `bun run format` formats authored supported files; the copied policy and lockfile are deliberately excluded. Oxlint covers TS/TSX and Vite/Vitest configuration with correctness, TypeScript, accessibility and test rules; it does not lint CSS/Markdown/JSON. Oxfmt covers authored TS/TSX/CSS/JSON/Markdown. The immutable policy is checked for fidelity and links, not reformatted. Build/native tool concurrency is bounded with `RAYON_NUM_THREADS=2`, `UV_THREADPOOL_SIZE=2`, tool `--threads 2`, and Vitest `--maxWorkers 2`; prerender concurrency is one.

Production startup requires a successful build and uses the actual Bun server at `.output/server/index.mjs`, not a generic preview. The pre-rendered homepage is `.output/public/index.html`; browser assets are `.output/public/_build/assets/`. `HOST`/`PORT` (and optional Nitro equivalents) set the listener and contain no secrets. Stop with Ctrl+C; do not check in build output, caches, `.env` files or credentials. Both verification servers and the owned browser tab were stopped/closed; the port no longer listens. No containers were needed.

## Verification and readiness

Tested on 2026-10-08, Linux, Bun 1.4.0, the initial foundation file state in the commit containing this record. Production client artifact: `entry-client-BoW2UjNe.js`; source/build/configuration were unchanged after the successful production/browser checks. Later documentation-only changes do not change that tested artifact.

- Installation: `bun install --network-concurrency 2` passed; 202 packages installed. `bun install --frozen-lockfile --network-concurrency 2` passed with no changes. No install/lifecycle errors reported.
- Strict project type check: `bun run typecheck` passed for source and both TS configurations using the shipped `nitro/tsconfig` base, with `strict: true`, no emit, and no application suppressions. **Declaration audit limitation:** the initial check without that base failed in Nitro/db0/unstorage declarations referencing unused optional database/cloud SDKs, plus Nitro's Rollup declarations. Nitro's own distributed base and upstream typecheck use `skipLibCheck`; that upstream scope is inherited here. Application and configuration API usage remain checked, but complete third-party `.d.ts` consistency is not established. Do not install unrelated provider SDKs to fill this gap; revisit declaration support when adopting those integrations or updating Nitro.
- Lint and format: `bun run lint`, `bun run format:check`, and the combined `bun run check` passed. Initial Oxlint diagnostics were fixed through explicit Solid ref assignments, labels wrapping their native controls, and a native output/status element; rules were retained.
- Behavior tests: `bun run test` passed 12 tests in one file. Includes division/rounding, blank/zero/negative/nonnumeric/NaN/infinite/overflow input in either field, dual errors and recovery, result overflow/underflow, and small positive rate display.
- Development: `bun run dev` reached Vite readiness; HTTP `/` returned the rendered calculator/labels. Ctrl+C stopped the owned process and the port stopped responding.
- Production: `bun run build` passed all client/SSR/Nitro stages, with preset `bun` and successful prerender of `/`. Nitro metadata confirms the Bun server entry. Build emitted the upstream `MISSING_CODE_SPLITTING_GROUP_DEBUG_NAME` warning about timing-report naming; output/startup worked, and the warning was not suppressed. This is an upstream diagnostic to recheck on tool upgrades.
- Runtime/HTTP: `HOST=127.0.0.1 PORT=43104 bun run start` served actual production output. Homepage HTTP 200 with English metadata/labels; referenced JS and CSS returned HTTP 200 with appropriate content types. Listener was loopback-only. Production Ctrl+C logged graceful shutdown and successful server closure; `ss -ltnp 'sport = :43104'` showed no listener and a follow-up fetch failed as expected.
- Real browser: T3 collaborative browser against the production server, at 1280×800, 390×844, and 320×800 CSS pixels. Inspected initial/valid-result screenshots, native labels and output/status semantics. Enter from the hours input returned `$50.00` for `6000 / 120`; editing hours to `60` returned `$100.00`. Zero hid stale output, marked hours invalid, retained income and focused hours on submission. Blank income focused income; `abc` and `Infinity` showed readable validation; valid input recovered. Tab reached the submit button with visible focus. No console errors or failed network requests; the calculation generated no API requests or URL changes.
- Layout/accessibility evidence: no horizontal overflow at 390px/320px; result visible on scrolling. At 320px, 200% root text enlargement reflowed without horizontal overflow or clipped controls. Six text/background color pairs measured contrast >=5.45:1; controls are at least 48px high; no animations exist. These checks are not a full WCAG audit, screen-reader test, native mobile-device test, or Safari/Firefox compatibility certification.
- JavaScript budget: all built public JS (one critical-route file) totals 22,986 raw bytes, **8,693 gzip bytes (8.49 KiB)** via `node:zlib` gzip under Bun, below the provisional 100 KiB compressed budget. This is an artifact-size measurement, not actual CDN transfer, hydration timing, LCP, INP, CLS or sustained-load evidence. No lab throttling/field telemetry/load tests were run.
- Persistent handoff: local Markdown links resolve; root instructions reach the core/decision record; the complete local core/reference snapshot matches the supplied selected package byte-for-byte. No continuation instruction requires kickoff, source paths, other profiles, or the setup conversation.

Readiness: the initial public calculator foundation is verified locally, including actual Bun production output and browser interaction. Hosting/CDN deployment, production TLS/cache/observability/recovery, traffic capacity, field performance and cross-browser/accessibility audit remain unverified under D04. Saved estimates and PDF export are blocked only if those future features are requested (D05/D06). There are no credentials or external-service prerequisites for continuing the current calculator locally.

## Official setup evidence

Consulted on 2026-10-08, alongside installed package metadata/types/CLI help:

- [SolidStart v2 overview](https://docs.solidjs.com/solid-start/v2), [getting started](https://docs.solidjs.com/solid-start/v2/getting-started), [deployment plugins](https://docs.solidjs.com/solid-start/v2/guides/deployment-plugins), [route prerendering](https://docs.solidjs.com/solid-start/v2/building-your-application/route-prerendering), and head/metadata guidance. V2 uses Solid v1 and Vite v8+; the official bare starter uses Nitro v3. Metadata lives in the server document since this app has only one public page and no router is needed.
- [Nitro Bun runtime](https://nitro.build/deploy/runtimes/bun): `bun` preset and Bun production server command. Installed `nitro/lib/tsconfig.json` supplied the compatible type-check base; production metadata and output confirm the selected target.
- [Bun installation CLI](https://bun.com/docs/pm/cli/install): frozen lockfile and bounded network concurrency.
- [Oxlint configuration](https://oxc.rs/docs/guide/usage/linter/config) and [Oxfmt configuration](https://oxc.rs/docs/guide/usage/formatter/config): supported configs, plugins, exclusions and installed CLI concurrency flags.
- [Valibot finite validation](https://valibot.dev/api/finite/) and installed schema types; [Vitest maxWorkers](https://vitest.dev/config/maxworkers.html) and installed configuration.

## Chosen decisions

### D01 — interactive rendering and runtime

- Status: chosen.
- Selection: SolidStart/SolidJS default, Vite supported build integration, Bun tooling and Bun production output. Nitro v3 is the official SolidStart v2 deployment integration. Use its pinned beta release; this is an upstream documented prerelease dependency, with upgrade risk. Pin/lock it and verify production output locally before any deployment.
- Basis: profile default for interactive web; supplied answers explicitly request that applicable defaults remain. Local arithmetic does not require a deliberately client-only rendering branch or an Astro content site.
- Scope: one pre-rendered public homepage with hydrated interaction. Regional hosting/CDN remains provisional under D04; no provider has been selected.
- Validation: build, prerender, actual Bun startup, route/assets, hydration and arithmetic. No claims about provider-specific deployment or throughput.

### D02 — browser-local calculation and validation

- Status: chosen.
- Selection: positive finite income and hours, divide locally, reject non-finite/zero results caused by machine-number overflow/underflow; readable dollar display rounded for presentation only. No server API, Rust, accounts, storage, or payment integration.
- Basis: explicit product answers and profile's local-only exception to backend ownership.
- Validation: focused numeric boundary tests and browser validation/recovery; no network submission of input.

### D03 — minimal UI and checks

- Status: chosen.
- Selection: native CSS (supported branch; shared atomic tokens unnecessary), native labeled form controls (no custom primitive behavior requiring Kobalte), Solid signals, Valibot default browser validation. Oxlint/Oxfmt and separate strict TypeScript checks; Vitest for changed numeric invariants.
- Basis: small coherent kickoff UI, low client bytes, and profile tooling defaults. StyleX/component catalogs and test/browser framework installations are unnecessary for this scope. Use available real-browser tooling for UI checks.
- Workflow: one local Bun package/lockfile, no orchestrator or remote CI/dependency automation until a remote workflow is actually required. No secrets or environment variables are required for the calculation.
- Type configuration: use Nitro's shipped strict base. Dependency declaration auditing is skipped by that base; the exact initial failure and coverage limit are disclosed above. No application type errors or lint rules are suppressed.

## Deferred decisions

### D04 — hosting, domain, and delivery operations

- Status: deferred.
- Question: which provider/region/domain and CDN should host the site, with what budget and operational requirements?
- Reason: user deliberately undecided; no account or deployment authority supplied.
- Safe provisional behavior: local Bun production server and pre-rendered homepage; no invented canonical URL, provider configuration, or caching claims.
- Blocked scope: remote deployment, DNS, provider-specific headers/cache rules, CI credentials, observability backend, TLS and production runtime/capacity validation.
- Can proceed: complete local application, checks and portable build.
- Trigger: before preparing an actual deployment or adding hosting-specific configuration.
- Next action: ask provider/region/domain/budget/operations question, then verify adapter, public HTML/immutable asset cache policies, health/shutdown, security headers, telemetry and release/rollback on that target. Measure representative lab and field performance after delivery setup; estimates do not authorize load tests.

### D05 — saved estimates

- Status: deferred.
- Question: should saved estimates be local-only or shared/persistent across devices and users?
- Reason: feature is possible later and data ownership is undecided.
- Safe provisional behavior: in-memory current form only; no storage, schema, auth, or placeholder service.
- Blocked scope: saved-estimate persistence and related identity/backend/data implementation.
- Can proceed: current public calculator and independent UI changes.
- Trigger: saved estimates become committed work.
- Next action: ask local-only versus shared persistence, then relevant retention/privacy/identity questions. Apply mapped local policy for the affected boundary; don't reopen unrelated settled choices.

### D06 — PDF export

- Status: deferred.
- Question: what content/layout should be exported, and must it be a downloaded PDF or is browser printing sufficient?
- Reason: feature is uncommitted.
- Safe provisional behavior: no export controls, dependency, service, or abstraction.
- Blocked scope: PDF implementation and delivery mechanism.
- Can proceed: initial calculator and ordinary independent development.
- Trigger: PDF export is requested as a concrete feature.
- Next action: clarify output/content/privacy and client-versus-server requirements before adding a minimal compatible implementation.

## Superseded decisions

None.
