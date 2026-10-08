# Architecture and request paths

Use for new architecture or changes to rendering, runtime/hosting targets, BFF identity, service ownership, or network paths. Apply the [core policy](../AGENTS.md) and the sections relevant to the affected boundary.

## Establish the workload and constraints

For architecture choices, establish rendering/critical paths, representative load, data and tenant/write ownership, consistency/recovery needs, deployment limits, and latency/throughput/browser/resource budgets using relevant repository context. Label assumptions where measurements are absent. Incremental work updates only affected decisions; use existing docs or a handoff note rather than requiring a new document.

Static content without server features needs no API, database, queue, or SSR process. Add capabilities when requirements need them, including at launch.

## Technology selection rules

| Concern | Default | Conditional alternative |
| --- | --- | --- |
| Interactive web | SolidJS + SolidStart | Astro + Solid islands for content; Solid + Vite for deliberately client-only rendering |
| Static content | Astro with pre-rendering | Existing suitable static pipeline |
| JavaScript runtime | Bun tooling and regional SSR | Verified compatible Workers target; Node.js only for a verified dependency/host requirement Bun cannot satisfy |
| Package management | Bun | pnpm when Bun is unsuitable; npm only when both are unsuitable |
| Frontend build | Framework-supported Vite/Rolldown integration | Supported alternative for compatibility/workload needs |
| Frontend lint/format | Oxlint + Oxfmt | Supplementary rules/tooling where required; retain a separate TypeScript check |
| Shared styling system | StyleX with compile-time extraction | CSS Modules/native CSS when a shared atomic/token system is unnecessary |
| Accessible UI primitives | Kobalte | Ark UI's Solid implementation or an existing suitable Solid design system |
| Local interaction state | Solid signals/stores | A measured additional state/caching requirement |
| Browser validation | Valibot | An existing suitable schema boundary; Rust remains authoritative |
| Backend | Rust + Axum + Tokio + Tower, with supported Hyper | Native alternative for explicit constraints or reproducible equivalent-service evidence |
| Public API contract | OpenAPI; `utoipa` when suitable | Reviewed explicit OpenAPI; gRPC/Tonic + Protobuf for internal streaming/contracts that require it |
| Browser API client | Generated types + openapi-fetch or an equivalent client | Existing compatible generated client |
| Transactional data | Patched PostgreSQL; verify support/provider compatibility for the PostgreSQL 18 baseline | Turso for embedded/tenant-owned data; specialized store for a demonstrated model |
| PostgreSQL access | SQLx, explicit reviewed SQL, compile-time checks where macros apply | A justified abstraction with measured cost |
| Cache | HTTP/CDN caching first | Valkey for measured hot reads, transient state, or coordination |
| Durable events/jobs | NATS JetStream when durable messaging is needed | A managed queue for operating simplicity; Redpanda/Kafka for proven partitioned-stream needs |
| Object storage | R2 or S3-compatible storage | A media pipeline when transformation/delivery requirements need it |
| Deployment | Regional VM/managed container near state, with useful CDN/WAF | More regions/Kubernetes for latency, availability, or organizational requirements |
| Observability | OpenTelemetry with an appropriate backend | Managed service or Prometheus/VictoriaMetrics + Grafana/Tempo/Loki and profiling as needed |

Use one authoritative contract/transaction model per boundary. Additional services, wrappers, or overlapping tools need a concrete requirement.

## Short request paths and rendering

- Pre-render suitable public routes; use Astro islands for content interaction and SolidStart for interactive SSR/routing.
- Default browser API calls to Rust under the appropriate origin; keep SSR near the API. A backend-for-frontend (BFF) is justified for server-held credentials/sessions, necessary API composition, or hosting constraints. Keep domain rules and resource authorization authoritative in Rust. Verify end-user credentials or authenticated BFF identity assertions; unverified forwarded IDs/headers are not trusted identity. Account for the added latency/failure path; avoid a Bun hop with no concrete purpose.
- Locate API/data together and define write ownership before adding regions. Edge ingress cannot remove database distance.
- Use supported streaming/hydration; fine-grained Solid reactivity does not automatically create an islands architecture.
- Validate the affected Bun/Workers production output, including relevant auth, streaming, cancellation, assets, database calls, and shutdown.
- Workers has partial Node support and distinct storage/execution limits. Verify targets/bindings; Bun does not run inside Workers.
- Evaluate Hyperdrive/Worker Placement by locality. Use cache-disabled paths for read-after-write requirements; cached reads are not automatically invalidated by writes.
- CDN HTTP/3 does not establish origin HTTP/3. Verify an actual Axum/Hyper integration and protocol behavior before claiming support.

## Official documentation

Use documentation matching the installed version.

- [SolidStart](https://docs.solidjs.com/solid-start/v2) and [deployment plugins](https://docs.solidjs.com/solid-start/v2/guides/deployment-plugins)
