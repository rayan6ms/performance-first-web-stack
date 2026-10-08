# Performance-first stack guide

Technology choices, alternatives, and architecture for this stack. For installation and a quick start, see the [README](../README.md).

## Contents

- [Choose this profile when](#choose-this-profile-when)
- [Design rules](#design-rules)
- [Reference architecture](#reference-architecture)
- [Core stack](#core-stack)
- [Frontend architecture](#frontend-architecture)
- [Images and delivery](#images-and-delivery)
- [Request and API design](#request-and-api-design)
- [Data path](#data-path)
- [Edge and deployment](#edge-and-deployment)
- [Reproducible engineering](#reproducible-engineering)
- [Security and identity](#security-and-identity)
- [Observability and reliability](#observability-and-reliability)
- [Testing and performance method](#testing-and-performance-method)
- [Growth path](#growth-path)
- [Technology decision matrix](#technology-decision-matrix)
- [Decision record](#decision-record)
- [Further reading](#further-reading)

## Choose this profile when

Use this profile for latency-sensitive APIs, high-traffic public applications, compute-heavy services, and teams able to operate Rust and infrastructure. Rust does not make a slow query, distant database, or oversized page fast by itself.

## Design rules

1. Keep the request path short and synchronous only for work needed to answer the request.
2. Put state near the process that owns it; make cross-region writes an explicit product decision.
3. Keep related business logic in a modular Rust application; split deployment units when independent capacity or failure isolation helps the workload.
4. Make retries, timeouts, idempotency, backpressure, and failure behavior part of every boundary.
5. Benchmark representative workloads in production-like conditions and validate with field data.
6. Meet correctness and availability targets while optimizing performance; report failures alongside latency so dropped requests cannot make a benchmark look faster.

The core stack is the default implementation. Capability recommendations cover workloads such as distributed events, search, analytics, and multi-region delivery. They can be part of the initial design when traffic projections, load tests, or product requirements justify them. A guide should explain advanced options before a reader needs them.

## Reference architecture

```text
Browser / API client
  │ HTTP/2 or HTTP/3 to the edge
  ▼
CDN / WAF / load balancing
  ├── cached HTML, scripts, styles, images
  ├── dynamic pages ── SolidStart SSR on Bun ─┐
  └── /api/* ───────────────────────────────┤
                                          ▼
                               Rust API: Axum + Tokio + Tower
                                 ├── SQLx pool ── [PgBouncer] ── PostgreSQL
                                 ├── Valkey: shared cache / transient state
                                 ├── NATS JetStream ── Rust job consumers
                                 └── R2 / S3: objects and exports
```

Choose the branches the product needs. Prerendered pages need no live SSR process. Put dynamic SSR near the Rust API, and the API near PostgreSQL. Browser API requests can route directly to Rust under the same origin, avoiding an extra JavaScript proxy. PostgreSQL, the cache, event transport, and object store are sibling dependencies of the service.

Cloudflare Load Balancing is the recommended managed option for health-based routing across origins. Envoy is the option for fine-grained origin traffic policy. Multiple regions are justified by latency or availability targets; write ownership and replication must be designed alongside them.

## Core stack

| Layer | Default | Why | Add or replace when |
| --- | --- | --- | --- |
| Interactive UI | SolidJS + SolidStart 2 | Fine-grained updates, SSR, streaming, and route-level loading | Astro for content/islands; Solid + Vite when the application deliberately needs only client rendering |
| Static/content delivery | Astro with islands | Sends little JavaScript and supports pre-rendering | The page is an interactive application rather than content |
| Frontend tooling | Vite with its supported Rolldown integration, TypeScript, Oxlint + Oxfmt | Fast builds, linting, and formatting | A required plugin needs a supplementary tool |
| JavaScript runtime | Bun for tooling and the regional SSR server | One runtime for compatible local tools and server execution | Workers is an alternative edge deployment target with a different runtime |
| Package manager | Bun | Installs, workspaces, and scripts integrated with the chosen runtime | pnpm when its workspace or dependency behavior better fits the repository |
| Styling | StyleX for a shared token-based design system | Build-time atomic CSS generation and explicit composition | CSS Modules/native CSS for simpler styling requirements |
| API | Rust + Axum + Tokio + Tower, on Hyper | Native execution, memory safety, explicit concurrency and middleware | Compare other native frameworks only against a reproducible service benchmark |
| Public contract | OpenAPI generated from the API; `utoipa` is one Rust option | Language-neutral clients and reviewable compatibility | Internal same-language calls can use a typed Rust module or a private RPC protocol |
| Database | PostgreSQL 18, with current supported patches | Transactions, indexes, extensions, mature tooling | Turso for embedded data or independent tenant databases; provider/extension constraints or a different data model |
| Rust database access | SQLx with reviewed SQL and compile-time checks | Avoids a large runtime ORM and keeps query plans visible | Use an ORM only when its productivity benefit is worth the abstraction |
| Cache | HTTP/CDN cache first; Valkey second | Avoids a network hop and keeps correctness in the database | A cache is justified by a measured hot read or coordination need |
| Events/jobs | NATS JetStream | Durable streams, pull consumers, and at-least-once processing | Use a hosted queue for a simpler operational boundary; use Kafka/Redpanda for proven partition-scale streaming |
| Files | Cloudflare R2 or S3-compatible object storage | Durable, inexpensive blob storage | Use a specialized media service for transcoding or delivery requirements |

## Frontend architecture

### Solid and SolidStart

SolidStart v2 is built on Solid v1 and Vite and has stable v2 releases. It supports deployment plugins such as Nitro and Cloudflare's Vite plugin. Keep it as the full-stack frontend default when SSR and routing serve the product. A client-only SPA is a different rendering choice, not an automatic performance upgrade.

Use v2's `vite.config.ts` and one deployment plugin, following its order and environment mapping. V1 Vinxi/`app.config.ts` examples use a different build model. The current v2 release accepts Vite 8 or 9 and documents Node 24+ as its supported baseline; verify development, build, and production execution separately when using Bun.

Prerender public routes where possible, stream expensive dynamic sections, and hydrate only what the selected rendering strategy supports. Solid's fine-grained reactivity reduces update work; it does not automatically make every SolidStart page an islands architecture. For content with isolated interactive widgets, Astro + Solid islands is the recommended alternative.

### Bun, package management, and deployment

Use **Bun** for dependency installation, compatible scripts, tests targeting Bun, and the regional SSR runtime. Use SolidStart's [deployment plugin](https://docs.solidjs.com/solid-start/v2/guides/deployment-plugins) with [Nitro's Bun preset](https://nitro.build/deploy/runtimes/bun) and test the actual production output. Keep application business logic in Rust; the JavaScript server renders pages and coordinates page data.

**pnpm is a package manager**, so it can replace Bun's install/workspace tooling while Bun remains the runtime. Some pnpm distributions run without a separate Node installation; that does not change the runtime requirements of tools and application scripts they launch. Pin one package manager and lockfile per workspace.

Node.js is not required by this reference architecture. Introduce it only for a verified dependency/tool/host requirement Bun cannot satisfy, with the exception documented and tested. Upstream Node compatibility metadata alone does not justify another runtime. Bun's Node compatibility is broad but not identical. A Node-based CI tool would also be a separate concern from the deployed request path.

For a scaffolded project with `dev` and `build` scripts that support Bun:

```bash
bun install --frozen-lockfile
bun run --bun dev
bun run --bun build
# After a Nitro build using preset: "bun"
bun run ./.output/server/index.mjs
```

Create and commit the lockfile before using the frozen install command. Bun's [`--bun` option](https://bun.sh/docs/runtime) matters because executable scripts may otherwise honor a Node shebang. It selects the runtime; it cannot make an incompatible plugin work. Benchmark install/build times separately from SSR latency, startup time, and resident memory.

### Native Bun capabilities

Consider native APIs for existing Bun web-tier responsibilities or build tooling; their availability does not move domain/API ownership out of Rust:

- **[S3Client](https://bun.com/docs/runtime/s3):** S3/R2 object access and presigning when a Bun-owned task needs them. Verify provider operations and credential/signing behavior; Rust-owned paths use a supported Rust client, and Workers can use its R2 binding.
- **[Bun.SQL](https://bun.com/docs/runtime/sql):** PostgreSQL, MySQL, or SQLite access for required Bun-owned data or tooling. Keep authoritative domain access in Rust/SQLx; avoid a new Bun hop solely to use this client. Preserve reviewed schemas/migrations, and remember that local SQLite is not a Turso integration.
- **[Bun.markdown](https://bun.com/docs/runtime/markdown):** straightforward build/server content rendering. As checked on 2026-10-08, it is documented as unstable; pin and test the selected API. Sanitize untrusted HTML output. Retain Astro's content pipeline where its features are needed; use HTML/custom rendering for Solid rather than assuming the React renderer is compatible.

Bun-native APIs require Bun execution and are unavailable in browser code, Workers, or Rust. Select them for covered requirements and measured benefits; retain suitable portable SDKs when needed.

### Vite, Rolldown, and Oxc

Use the Vite version supported by SolidStart and its deployment plugin. Current [Vite documentation](https://vite.dev/guide/) describes Rolldown as its production bundler; a separate manual bundler swap is unnecessary for that release line. Oxlint and Oxfmt handle linting and formatting. Keep a TypeScript type-check in CI because transpilation alone does not check types.

### Styling and UI

**StyleX** remains recommended for a reusable design system: atomic CSS extraction, token/theme variables, deterministic composition, and colocated styles are useful at scale. Its [compiler setup](https://stylexjs.com/docs/learn/installation/) moves style generation to build time. Dynamic values and style composition can still require runtime work, so compare the emitted CSS, JavaScript, and rendering cost instead of assuming zero overhead.

StyleX is not restricted to React: its [`stylex.attrs` API](https://stylexjs.com/docs/api/javascript/attrs/) explicitly covers frameworks including Solid. Validate the chosen compiler integration with SolidStart's SSR, lazy routes, hydration, themes, and production CSS extraction. CSS Modules or native CSS remain strong alternatives when a shared atomic styling system brings little benefit.

```text
Design tokens → StyleX theme variables → UI primitives → product components
```

Use **Kobalte** for accessible Solid primitives or **Ark UI** for a broader headless component set with a Solid implementation. Build one product design system on the chosen primitives. Check keyboard navigation, focus management, and reduced-motion behavior. Prefer compositor-friendly animations, and virtualize large lists only when their rendering cost warrants it.

### State, forms, and validation

Prefer route/server data for persistent state, Solid signals for local interaction, and Solid stores for related structured state. Add a remote-data cache when the product needs refetching, optimistic updates, or offline behavior; avoid mirroring every response in another global store.

Use native forms and SolidStart actions where appropriate, with **Valibot** for modular client-side validation. Enforce validation and authorization in Rust regardless of browser checks. Generated OpenAPI TypeScript types do not perform runtime validation. Keep one documented wire format for dates, identifiers, decimal amounts, and errors across the two languages.

### Effect for Bun-side orchestration

**[Effect](https://effect.website/docs/v4/getting-started/why-effect)** is an optional application-layer choice when the Bun tier needs substantial orchestration: coordinating concurrent page data, streaming, provider calls, deadlines, or resource cleanup. Typed expected failures, service dependencies, and bounded concurrency can make this work easier to reason about. Use its [Bun platform integration](https://effect.website/docs/v4/platform/introduction) where appropriate and connect request cancellation to the underlying clients.

Keep domain rules and the primary API in Rust. Direct browser-to-Rust requests should retain their short path; adopting Effect does not require a new TypeScript proxy service. Tokio and Tower continue handling Rust-side scheduling and middleware. Execute Effect at an existing SSR or task boundary and map failures to the documented HTTP contract.

An existing or required Bun backend-for-frontend can use Effect under the routing criteria below; Rust retains authoritative domain and resource authorization rules.

Plain functions and `async`/`await` remain the default for simple page coordination. Compare equivalent implementations for p95/p99 latency, allocations, memory, startup, and client bundle size before extending Effect to a critical path. Keep server dependencies out of browser imports and use an external persistence mechanism for work that must survive restarts. As checked on 2026-10-07, [Effect 4.0](https://effect.website/blog/releases/effect/40) is stable, with some modules still marked unstable or experimental; its v4 benchmarks compare Effect versions and do not establish superiority over plain TypeScript.

### Browser delivery

Set explicit image dimensions, use responsive AVIF/WebP where supported, subset fonts, and split bundles by route. Reserve lazy loading for off-screen content; the LCP image needs prompt discovery and loading. Keep analytics, editors, charts, and nonessential widgets out of the initial critical path. Measure browser execution and hydration as well as compressed bytes.

## Images and delivery

Prefer reusable variants generated during builds or uploads where the image set and required sizes allow it, then serve them through a CDN. Cached on-demand transformations suit changing layouts or media libraries where precomputing every variant costs more. Keep expensive processing out of the normal page/API path unless a synchronous result is required.

- **[Astro `<Image>` / `<Picture>`](https://docs.astro.build/en/guides/images/):** the first choice in the content profile, with a compatible image service. A passthrough service performs no transformation.
- **[Unpic](https://unpic.pics/img/):** responsive Solid components around an image CDN/service, using native loading behavior without adding a separate client-side image loader by default. The provider transforms the images.
- **[vite-imagetools](https://github.com/JonasKruckenberg/imagetools/blob/main/packages/vite/README.md):** Sharp-backed generation of sizes, formats, and `srcset` data for imported static Vite assets. Use it when the existing framework pipeline does not cover that role.
- **[Cloudflare Images transformations](https://developers.cloudflare.com/images/optimization/transformations/overview/):** managed processing and edge-cached variants, including images stored in R2. R2 alone provides no image transformation.
- **[imgproxy](https://docs.imgproxy.net/):** a self-operated libvips HTTP transformer behind a CDN/cache, independent of the Rust application service.

**[Bun.Image](https://bun.com/docs/runtime/image)** can process supported images in Bun-hosted jobs or build tools without a separate addon. **[Sharp](https://sharp.pixelplumbing.com/)** also runs under Bun and offers broader formats/operations. As checked on 2026-10-08, Bun's AVIF/HEIC support is unavailable on Linux and depends on OS codecs/hardware elsewhere; verify the actual processing target. Bun Image supplies transformation, while responsive markup and endpoint/cache behavior need their own integration. Vendor processing benchmarks do not establish better visual quality, compression, or browser performance.

Generate appropriate `srcset`/`sizes`, preserve aspect ratios and stable dimensions, and load the LCP image promptly. Bound source access, bytes/pixels, variant counts, and concurrency; isolate transformation capacity from latency-sensitive API work. Version source/transform cache keys and preserve private-file authorization for originals, variants, and caches. Compare equivalent visual quality, delivered bytes, cold/cache-hit latency, throughput, CPU/memory, and cost.

## Request and API design

Default browser API requests to Rust under the appropriate origin. A backend-for-frontend (BFF) can be useful for server-held credentials/sessions, necessary API composition, or hosting constraints. Keep Rust authoritative for domain rules and resource authorization. Rust must verify end-user credentials or authenticated BFF identity assertions; forwarded IDs/headers without that verification are not trusted identity. Account for the extra latency/failure boundary. A forwarding hop needs a concrete purpose.

The hot path should be easy to draw:

```text
request → limits and parsing → authenticate → validate and authorize → bounded data work → response
```

Use Tower middleware for request IDs, deadlines, body limits, compression, rate limits, authentication, and tracing. Set a deadline shorter than the upstream client timeout, propagate cancellation, and bound concurrency. Do not retry non-idempotent work without an idempotency key. Return stable error codes and a `Retry-After` value where a retry is safe.

### Rust runtime responsibilities

| Component | Responsibility | Performance implication |
| --- | --- | --- |
| Axum | Routes, extractors, responses, application composition | Keep handlers thin and validate bounded inputs |
| Tower / tower-http | Service composition and HTTP middleware | Configure timeouts, limits, and middleware order explicitly |
| Hyper | HTTP machinery underlying the selected server stack | Usually used through Axum; add direct integration only when needed |
| Tokio | Async scheduling and I/O | Keep blocking and CPU-heavy work off async executor threads |
| Rust | Native code, ownership, and resource control | Removes a garbage collector from the Rust service, but does not guarantee bounded tail latency |

Bound spawned tasks, connection pools, and buffers. Use a bounded blocking pool or dedicated compute workers for CPU-intensive work; consider Rayon for appropriate parallel CPU workloads. Profile allocations, serialization, and lock contention before changing allocators or using unsafe optimizations. Release builds, realistic concurrency, and equivalent middleware are required for a useful comparison.

Publish OpenAPI for browser, mobile, and polyglot consumers, using `utoipa` or a reviewed specification. Generate TypeScript types with [openapi-typescript](https://openapi-ts.dev/) and use `openapi-fetch` or another generated client. oRPC's TypeScript inference does not cross a Rust boundary automatically. It can remain in a separate TypeScript service, but adding that service solely to wrap Rust creates another hop and contract to maintain.

For internal Rust services, begin with HTTP and OpenAPI. Add gRPC with Tonic and Protobuf when streaming, strict service contracts, or language-neutral internal RPC justify the operational cost. Avoid a service mesh until service count and failure modes warrant one.

HTTP/3 is a transport choice at a particular connection, not a requirement of JSON or oRPC. The CDN can terminate HTTP/3 while talking HTTP/1.1 or HTTP/2 to the origin. Do not assume an Axum/Hyper service has HTTP/3 support just because its CDN does. Benchmark real network conditions and compression costs; retain protocol fallbacks.

## Data path

### PostgreSQL

**PostgreSQL 18** is a valid supported baseline as checked on 2026-09-15. Apply supported minor updates and check provider, extension, and backup-tool compatibility before a major upgrade. The [versioning policy](https://www.postgresql.org/support/versioning/) is the source for support dates. A guide can recommend a major version while applications pin the exact deployed release.

Keep transactional truth in PostgreSQL. Design indexes from `EXPLAIN (ANALYZE, BUFFERS)` on representative data. Select columns explicitly, paginate by a stable indexed key, batch writes, and avoid N+1 queries. Use connection pooling and a least-privilege role. Keep transactions short and never hold one open while calling a network provider.

PgBouncer in transaction mode is useful for many short transactions, but it changes PostgreSQL session semantics: session state, `LISTEN`, session advisory locks, and some prepared-statement patterns are not available in the same way. Confirm SQLx and driver settings against the pool mode. If the application needs session features, use session pooling or a direct pool for that path.

Use WAL archiving, point-in-time recovery, encrypted backups, and a restore drill. A read replica improves read capacity and sometimes geographic latency; it does not provide automatic conflict-free multi-region writes. Define replica staleness and read-after-write behavior in the application.

Use **SQLx** for explicit queries, migrations, and compile-time query checks where its macros are used. Keep offline query metadata synchronized if builds run without a database, and still test dynamic queries against PostgreSQL. Cap total application pool sizes across replicas so autoscaling cannot exhaust the database.

For self-managed PostgreSQL, **[pgBackRest](https://pgbackrest.org/)** is the recommended backup/WAL tool; managed PostgreSQL can provide equivalent backup and PITR capabilities. An object store such as R2 can be a backup destination when the tool's S3 integration has been verified. Define retention, independent access credentials, recovery point objective (RPO), and recovery time objective (RTO). High availability and backups serve different failure modes.

### Turso and embedded data

**[Turso](https://docs.turso.tech/introduction)** is a performance-oriented database alternative when data can live inside its owning process, local reads dominate, synchronization is required, or tenants have independent databases. It can be the primary store for that deployment profile from launch. PostgreSQL remains the reference default for shared relational state, its extensions, and mature operations.

Separate the older SQLite-derived **libSQL** engine, the newer Rust-based **Turso Database** engine, and the managed **Turso Cloud** service. The Rust engine supports MVCC with `BEGIN CONCURRENT`, and its [0.8 release](https://turso.tech/blog/turso-0.8.0) improves concurrent writes. Its workload-specific comparisons with SQLite do not select a winner against PostgreSQL. As checked on 2026-10-07, the [project FAQ](https://github.com/tursodatabase/turso#faq) reports production use while noting pre-1.0 status, compatibility gaps, and experimental features.

Embedded queries eliminate a database network round trip and a separate database process for that access path. Remote HTTP access still crosses a network. Use a supported Rust SDK for the chosen engine/access mode and revise repository code, migrations, and query checks. SQLx's PostgreSQL integration does not establish Turso support, and Turso's experimental PostgreSQL frontend does not establish equivalent PostgreSQL behavior. Cap blocking work, connection/task concurrency, and buffers according to the SDK's execution model. Embedded files need suitable storage, backup, and failover ownership; stateless replicas do not automatically share them.

Choose consistency deliberately. Legacy [libSQL embedded replicas](https://docs.turso.tech/features/embedded-replicas/introduction) forward writes to a primary by default; [Turso Sync](https://docs.turso.tech/sync/usage) uses local writes with explicit push/pull and last-push-wins conflict handling. Define replica staleness, conflict handling, and which owner can enforce shared invariants. A local commit must not be treated as proof that all regions have accepted the same state.

Databases per tenant can distribute independent workloads, with additional work for fleet migrations, provisioning, backups, cross-tenant reporting, and transactions. Benchmark realistic queries, data size, write contention, p99 latency, memory, sync/recovery cost, and equivalent durability settings. Validate independent restores and recovery objectives. Select this profile because the measured data ownership and access pattern fit, rather than expecting one database choice to maximize every form of scalability.

### Valkey

Use Valkey for ephemeral state, hot cache entries, rate-limit counters, or short-lived coordination. Specify TTLs and maximum memory behavior. Namespaces, serialization limits, and a cache-miss fallback belong in code. Do not store the only copy of business data in a cache.

### NATS JetStream

Core NATS is at-most-once for connected subscribers; JetStream adds persistence and supports at-least-once delivery. Use explicit acknowledgements, durable pull consumers, bounded redelivery, and an application-managed dead-letter or quarantine path. Include a message ID and make handlers idempotent. JetStream's deduplication and double-ack mechanisms support scoped exactly-once messaging semantics; they do not make a PostgreSQL write or external payment atomic with an acknowledgement.

Configure storage, replication, acknowledgement policy, retention, and deduplication windows for the required durability. Use a transactional outbox when a PostgreSQL change must produce an event reliably, and acknowledge work only after durable completion. Test consumer restarts and duplicate delivery. JetStream provides event transport; complex multi-step business workflows may need additional orchestration.

Use a hosted queue when a managed retry/dead-letter experience is more valuable than operating NATS. Cloudflare Queues also provides at-least-once delivery; deduplicate with a unique database or provider idempotency key.

### Object storage

Upload directly using short-lived signed URLs. Verify size and content type, record metadata in PostgreSQL, and process untrusted files asynchronously. Set cache headers and immutable names for content-addressed assets.

## Edge and deployment

Cloudflare is a good edge layer for CDN, DNS, WAF, DDoS protection, Workers, R2, and Queues. Run the Rust API as a conventional service close to PostgreSQL unless an edge-compatible Rust target and database path have been tested. Cloudflare Workers' Node compatibility is partial; an importable shim may still throw at runtime.

If a Worker must access centralized PostgreSQL, Hyperdrive can pool origin connections and cache non-mutating reads. It does not invalidate cached reads after writes. Use a cache-disabled configuration for paths requiring read-after-write consistency, and consider Worker Placement near the database when a request performs several sequential queries. Measure this against a regional API; edge is not automatically lower latency.

Choose one deployment shape first:

- **VM or managed container:** simplest Rust runtime and broadest ecosystem compatibility.
- **Kubernetes:** use only when scheduling, isolation, or organizational requirements justify its control-plane cost. Cilium and Envoy are later options, not baseline dependencies.
- **Cloudflare edge plus regional origin:** useful for cached public traffic and globally distributed ingress; keep writes and stateful work near their owner.

Use rolling deployments by default. Add blue/green or canaries when rollback time and blast radius justify them. Migrations must be backward compatible across the old and new application versions.

## Reproducible engineering

Start with a Cargo workspace and a JS workspace only when there are multiple packages or deployables:

```text
apps/
  web/                  # Solid, Astro, or SolidStart
services/
  api/                  # Axum binary
crates/
  domain/
  persistence/
  auth/
packages/
  contracts/             # generated OpenAPI clients
infra/
docs/adr/
```

Use Nix or Dev Containers to pin system tools. Use Turborepo for JS tasks. Add Bazel when a large repository, remote cache, or polyglot build graph has demonstrated a need; running Nix, Bazel, and Turborepo for a small app increases build and debugging cost. OpenTofu can manage cloud resources, but keep its state protected and review plans in CI.

The intended infrastructure layering is:

```text
Nix / NixOS        reproducible developer and host environments
OpenTofu           cloud resources and networking
Bazel              large/polyglot build graph and remote cache
Turborepo          JavaScript package task graph
```

Useful platform tools include GitHub Actions, Release Please, Renovate, Just, direnv, SOPS with age, Trivy, `cargo-audit`, and `cargo-deny`. Use GitHub Actions for checks and release automation; keep credentials in the CI secret store and deploy with short-lived identity where the provider supports it. Treat remote build execution as an optimization with a measured cache hit rate, not a prerequisite for a fast local loop.

Expose one documented verification command, such as `bun run verify` or `just verify`, covering applicable non-mutating frontend types, Rust checks, lint/format, meaningful local tests, and contract checks. Keep builds, live-service checks, migrations, and deployment explicit. Prefer stable compatible release combinations; document and pin any required prerelease adapter with its support limits and validation/fallback.

## Security and identity

Use an OIDC provider and standards-based flows (Authorization Code with PKCE, WebAuthn/passkeys, and MFA where appropriate). Managed providers such as WorkOS, Auth0, Clerk, or Cognito reduce identity operations; Keycloak is an option when self-hosting is a requirement.

Authorize every resource access in the service. OpenFGA is useful for relationship-based authorization; Cedar is useful for policy evaluation. Either requires a policy model, tests, and an availability plan. Protect secrets with a manager, rotate credentials, set security headers, restrict outbound access, and maintain a dependency SBOM.

## Observability and reliability

Instrument HTTP, SQLx, NATS, provider calls, and background jobs with [OpenTelemetry](https://opentelemetry.io/). A practical self-managed stack is Prometheus or VictoriaMetrics, Grafana, Tempo, Loki, and Parca or Pyroscope. Sentry, Honeycomb, and managed equivalents are good choices when operating the storage is not your product.

Every service needs structured logs, traces linked by request ID, saturation metrics, and profiles for CPU and allocation hotspots. Sample traces deliberately and redact credentials and personal data. Monitor queue age, redeliveries, pool exhaustion, replica lag, cache hit rate, and cost.

Define SLOs and error budgets for the user-visible paths. Production readiness includes:

- automated backups, point-in-time recovery, and a tested restore
- health, readiness, and dependency checks
- bounded timeouts, retries, and circuit breakers
- graceful shutdown and queue draining
- capacity tests and a failure-injection exercise
- rollback instructions and a current on-call owner

## Testing and performance method

Set a workload before setting a target. Record p50, p95, and p99 latency, throughput, error rate, CPU, memory, allocations, database time, and network bytes. Run load tests against production-like data and hardware; a synthetic hello-world benchmark cannot select this stack.

For web UI, measure field data at the 75th percentile. Current Core Web Vitals “good” thresholds are LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1. Set route-specific budgets for HTML, JavaScript, images, and fonts, then enforce them in CI and a real-browser smoke test.

Consider these optimization opportunities, starting with the measured bottleneck:

- remove unnecessary work and round trips;
- place compute and data together;
- cache safe reads and use a CDN;
- reduce response and asset bytes;
- batch and index database work;
- profile before changing algorithms or runtimes.

Use **Vitest** for frontend and TypeScript package tests, **Testing Library** for behavior-focused components, and **Playwright** for real-browser journeys. Run Rust unit tests, integration tests against PostgreSQL, API contract tests, and load tests in CI or a production-like environment. Cloudflare Workers code needs the supported Workers Vitest integration; a Node test process alone does not prove that a Worker dependency works. Run accessibility checks and production bundle/build smoke tests.

For the Turso profile, run integration tests against the selected engine and access mode, including contention, synchronization conflicts, restarts, and restoration. For Effect adoption, verify error mapping, cancellation, resource cleanup, and concurrency limits as well as successful requests.

For a public web app, a useful initial budget is under 100 KiB compressed JavaScript on the critical route, LCP under 2 seconds at the chosen test profile, INP under 200 ms, and CLS under 0.1. These are engineering budgets, not universal guarantees. The current Core Web Vitals “good” thresholds are LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1 at the 75th percentile of field data. Publish the device, connection, region, and cache state beside any stricter claim.

### Advanced performance and scale

These are supported options in the architecture, not a second mandatory baseline.

#### Networking and eBPF

Use **Cilium** when Kubernetes networking, network policy, or eBPF-based observability is a demonstrated need. **Pixie** can provide high-level Kubernetes telemetry without application changes. **Envoy** is useful for advanced load balancing, retries, mTLS, and traffic policy. These add agents, memory, configuration, and failure modes; measure their value before deployment.

#### Analytics and data workloads

- **ClickHouse** is the recommended analytical store for high-volume columnar scans and aggregations.
- **DuckDB** is excellent for embedded analytics, local investigation, and batch transformations.
- **ScyllaDB** is an option for very high-throughput, partition-oriented workloads that fit its consistency and data-model constraints. It is not a drop-in PostgreSQL replacement.

Keep analytical copies or event-derived models separate from transactional truth. Define freshness, backfill, retention, and schema-evolution behavior.

#### Events and streaming

Use **NATS JetStream** for application events and durable jobs. **Redpanda** or **Kafka** are options when partitioned retention, replay, consumer-group scale, or ecosystem integration is the measured requirement. They require more capacity planning and operational ownership than NATS. Do not use a larger log simply because it is familiar.

#### Search

Use PostgreSQL full-text search for transactional search. Add **Meilisearch** for a simple typo-tolerant product index, **Tantivy** when an embedded Rust search library is a better fit, or **OpenSearch** for a distributed search and aggregation platform. **Algolia** is a managed alternative when provider cost and dependence are acceptable. Test relevance and indexing lag with a representative corpus.

#### WebAssembly

Use **Wasmtime** for a controlled WebAssembly runtime in a service or plugin boundary. **Spin** is an option for WebAssembly microservices and HTTP components. WebAssembly is useful for sandboxing and portable compute; it does not make an I/O-bound query faster automatically.

#### Build acceleration

Use Bazel for a large polyglot build graph, remote caching, and reproducible artifacts. **EngFlow** and **BuildBarn** are remote execution/cache options when organization scale justifies them. Measure cache hit rate and end-to-end developer wait time; a remote cache that misses often can be slower than a local build.

#### Specialist optimization

Use profiles and flamegraphs before changing allocators, introducing `unsafe`, or writing a native extension. Keep a benchmark suite for serialization, compression, SQL, request routing, and representative end-to-end flows. Re-run it on every runtime, compiler, database, or network change.

## Growth path

### Stage 1: small production

One Rust API, one SolidStart/Bun web process where SSR is needed, one PostgreSQL primary (or the Turso profile when data ownership fits), object storage, CDN/WAF, and a managed deployment. Add OpenTelemetry, backups, restore testing, deadlines, and a basic load test before adding more components. Database recovery controls must match the chosen engine and deployment mode.

### Stage 2: measured pressure

Add read replicas, Valkey, a queue, a worker process, and CDN caching for the bottleneck you measured. Introduce PgBouncer if connection counts—not query execution—are the limit. Add NATS JetStream when durable event processing is a requirement; a queue and an event log do not need to be the same system.

### Stage 3: organizational or regional scale

Split services by ownership and failure domain. Add canaries, independent autoscaling, regional read paths, and a service-to-service contract. Consider Envoy, Cilium, Kubernetes, or a remote build cache when their operational benefits exceed their cost. Put a load balancer and service discovery under explicit health checks, timeouts, and rollback rules.

### Stage 4: specialist workloads

Adopt ClickHouse for analytical scans, DuckDB for embedded/batch analytics, Redpanda/Kafka for proven partitioned stream volume, Tantivy/Meilisearch/OpenSearch/Algolia for search requirements, ScyllaDB for a demonstrated partitioned access pattern, or Wasmtime/Spin for a sandboxed portable compute boundary. Keep PostgreSQL as the system of record where its transactional guarantees fit.

## Technology decision matrix

| Problem | Default | Scale or specialist path |
| --- | --- | --- |
| Frontend | SolidStart 2 + Bun + Vite/Rolldown | Astro islands; Solid + Vite for client-only pages |
| Bun-side orchestration | Direct calls and `async`/`await` for simple page coordination | Effect for typed failures, resource scopes, and controlled concurrency |
| Backend | Rust + Axum + Tokio + Tower | Modular services; gRPC/Tonic when the contract requires it |
| Database | PostgreSQL 18 | Read replicas; Turso for embedded or tenant-owned data; ScyllaDB for a different partition model |
| Database access | SQLx pool for PostgreSQL | PgBouncer for PostgreSQL pooling; engine-specific Rust SDK for Turso |
| Cache | CDN/HTTP cache | Valkey; distributed cache only with explicit consistency rules |
| Events/jobs | NATS JetStream | Redpanda/Kafka for partition-scale streams; managed queues for managed operations |
| Analytics | PostgreSQL queries | DuckDB for local/batch; ClickHouse for columnar analytics |
| Search | PostgreSQL FTS | Tantivy, Meilisearch, Algolia, or OpenSearch |
| Objects | R2 or S3-compatible storage | Media processing service or multi-region storage |
| Images | Reusable variants + CDN; Astro components or Unpic for markup | vite-imagetools for static assets; Bun Image or Sharp in suitable jobs; Cloudflare Images or imgproxy for dynamic delivery |
| Native Bun APIs | S3Client, SQL, or Markdown for required Bun-owned work/tooling | Rust clients for Rust-owned paths; platform bindings or portable SDKs where appropriate |
| Networking | CDN/WAF and direct origin | Cloudflare Load Balancing; Envoy + Cilium on Kubernetes |
| Observability | OpenTelemetry + managed backend | Prometheus/VictoriaMetrics, Grafana, Tempo, Loki, Parca/Pyroscope |
| Builds | Cargo/Vite/Turborepo | Bazel + EngFlow/BuildBarn remote execution |
| Compute extensions | Native Rust process | Wasmtime/Spin for WebAssembly isolation |

## Decision record

For every non-baseline component, record the limiting metric, workload and benchmark, alternatives considered, operational owner, failure mode, data lifecycle, security impact, and removal path. Revisit the decision after a major traffic or product change.

## Further reading

- [SolidStart v2](https://docs.solidjs.com/solid-start/v2)
- [Axum](https://docs.rs/axum/latest/axum/)
- [Tokio](https://tokio.rs/)
- [SQLx](https://github.com/launchbadge/sqlx)
- [NATS JetStream concepts](https://docs.nats.io/nats-concepts/jetstream)
- [Cloudflare Hyperdrive](https://developers.cloudflare.com/hyperdrive/concepts/how-hyperdrive-works/)
- [Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Core Web Vitals](https://web.dev/articles/vitals)
- [OWASP ASVS](https://github.com/OWASP/ASVS)
- [StyleX compiler](https://stylexjs.com/docs/learn/installation/)
- [pgBackRest](https://pgbackrest.org/)
- [Tantivy](https://github.com/quickwit-oss/tantivy)
- [Wasmtime](https://wasmtime.dev/)
- [System Design Primer](https://github.com/donnemartin/system-design-primer)
- [Effect programming model](https://effect.website/docs/v4/getting-started/why-effect)
- [Effect Bun platform integration](https://effect.website/docs/v4/platform/introduction)
- [Turso engines and production status](https://github.com/tursodatabase/turso#faq)
- [Turso Sync](https://docs.turso.tech/sync/usage)
