# Rust services and Bun coordination

Use for Rust HTTP/domain implementation, API contracts, task/concurrency control, or substantive Effect orchestration in a justified Bun tier. Apply the [core policy](../AGENTS.md) and the sections relevant to the affected boundary.

A Bun BFF must follow [architecture and request-path criteria](architecture.md). Use [integrations](integrations.md) for identity/session or external-provider behavior.

## Rust service implementation

### Domain and HTTP boundaries

- Keep handlers focused on transport and domain calls; substantive invariants belong outside transport glue without requiring a layer per operation.
- Bound bodies, enforce content types, and use Serde structures plus domain validation; deserialization provides neither business validation nor authorization.
- Define wire formats for timestamps, IDs, decimal money, binary data, and errors. Avoid JSON numbers that lose precision in JavaScript.
- MUST authorize each action against its resource/tenant; supplied IDs and generated types grant no permission.
- Parameterize values and construct queries safely. Map expected failures to stable public HTTP/error codes; correlate defects without exposing SQL, traces, secrets, or internals.
- Avoid panics, `unwrap`, and `expect` for untrusted input or routine dependency failures; distinguish test/setup invariants from recoverable errors.
- Review OpenAPI, generate compatible clients, and retain server validation. Generated types have no runtime enforcement, and TypeScript RPC inference does not cross Rust; do not add a forwarding service solely for inferred types.

### Concurrency, cancellation, and resource control

- Use Axum routes, Tower/tower-http middleware, Hyper HTTP, and Tokio I/O without duplicate server layers.
- Set middleware order, IDs, limits, deadlines, auth, tracing, and compression. Handler timeouts do not prove downstream cancellation.
- MUST bound tasks, queues, pools, buffers, and outbound concurrency with explicit admission/rejection/backpressure. Move blocking/CPU work off Tokio executors into bounded pools; use Rayon for suitable parallel computation.
- Supervise tasks, propagate supported cancellation/deadlines, drain on shutdown, and define ownership after disconnect.
- Retry eligible transient failures with bounded jitter/backoff and total deadlines. Mutations need durable idempotency; cancellation cannot undo accepted side effects.
- Reuse clients/pools, measure contention, and never hold critical locks/transactions across unrelated provider calls.
- Profile allocation, copying, serialization, algorithms, and compression before low-level changes. `unsafe` needs demonstrated value, safety invariants, and validation.

## Effect in the Bun tier

Use Effect conditionally for substantial Bun page-data coordination, streaming, providers, or resource/concurrency handling. Keep domain/API ownership in Rust; a Bun BFF follows the [architecture routing criteria](architecture.md).

Use compatible Bun integration; model failures/dependencies, reuse services, scope request-owned tasks, bound concurrency, and propagate supported cancellation. Map errors to the contract; fibers/retries are not restart-durable. Check module stability, exclude server dependencies from browser bundles, and compare equivalent tail latency, allocations, memory, and startup before expanding adoption.

## Official documentation

Use documentation matching the installed version.

- [Axum](https://docs.rs/axum/latest/axum/), [Tokio](https://tokio.rs/), and [SQLx](https://github.com/launchbadge/sqlx)
- [Effect Bun integration](https://effect.website/docs/v4/platform/introduction)
