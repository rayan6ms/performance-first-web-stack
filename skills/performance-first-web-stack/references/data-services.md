# Caching, durable events, and object storage

Use for HTTP/Valkey caching, NATS JetStream/queue processing, or upload/file lifecycle. Apply the [core policy](../AGENTS.md) and the sections relevant to the affected boundary.

Image processing/delivery also uses [frontend and images](frontend.md); specialist streams or stores use [admission criteria](advanced.md).

## HTTP/CDN and Valkey caches

Use safe HTTP/CDN caching first; add Valkey for a hot path or coordination need. Define ownership, TTL, tenant partitioning, value/memory limits, eviction, invalidation, and outages. Bound database fallback load; choose security-sensitive fail-open/closed behavior. Leases need expiry/stale-writer defenses; keep durable truth and invariants in the authoritative store.

## NATS JetStream and other durable queues

- Core NATS is at-most-once for connected subscribers. Use JetStream for durable transport; default to at-least-once application processing.
- Define storage, replication, retention, acknowledgements, deduplication windows, bounded pull consumers/concurrency, retry limits, and inspectable quarantine/dead letters.
- MUST make consumers idempotent and acknowledge after durable completion. Messaging's scoped exactly-once mechanisms do not atomically couple acknowledgements to database updates/payments.
- Use transactional outbox or equivalent reliable database-to-event publication. Test crash/restart, duplicates, redelivery, and replay.
- Hosted queues simplify operations; Redpanda/Kafka need proven partitioned retention/replay/consumer requirements. Complex workflows need explicit durable orchestration beyond transport.

## Object storage

Use R2/S3-compatible blobs: authorize short-lived uploads, validate final size/type/ownership, quarantine/process untrusted content asynchronously, and store authoritative metadata. Use immutable names/cache headers; reconcile failed uploads/deletion.

## Official documentation

Use documentation matching the installed version.

- [NATS JetStream](https://docs.nats.io/nats-concepts/jetstream)
