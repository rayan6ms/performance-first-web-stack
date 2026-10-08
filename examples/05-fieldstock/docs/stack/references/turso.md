# Turso policy

Use for Turso/libSQL, Rust SDK access, embedded/tenant databases, local/offline synchronization, or recovery. Apply the [core policy](../AGENTS.md) and the sections relevant to the affected boundary.

## Turso profile

- Record engine, Rust SDK, access mode, and hosting; SQLite-derived libSQL, Rust Turso, and Turso Cloud differ.
- Verify compatibility, maturity, and concurrency; Rust Turso's MVCC/`BEGIN CONCURRENT` means single-writer assumptions are not universal.
- SQLx's PostgreSQL driver does not integrate Turso. Review SDK code, SQL/types/constraints, migrations, and query checks.
- Embedded queries avoid network hops; HTTP does not. Define file durability/disk limits, writer ownership, backup/restart/failover; stateless replicas do not automatically share local files.
- Distinguish primary-forwarded replicas from local-write sync; verify read-your-writes, lag/cadence, conflicts, bootstrap, and offline behavior.
- Where sync uses last-push-wins, MUST NOT rely on it alone for global payment, inventory, or uniqueness invariants. Define an authoritative owner/transaction protocol for shared state.
- Before combining disconnected conflicting writes with a global invariant, specify exclusive allocations/rights, another proven coordination scheme, or online authorization. State the offline availability tradeoff, and preserve rights/invariants through replay, restoration, and cloned device state; unrestricted independent sales cannot be made safe by later conflict resolution alone.
- Tenant databases need provisioning, scoped credentials, fleet migrations/backups/deletion, reporting, and cross-database transaction semantics.
- Benchmark relevant queries/contention, durability, sync, memory, and recovery. Test conflicts/restarts/reconnects/restores; local commits prove neither global acceptance nor backup durability.

## Official documentation

Use documentation matching the installed version.

- [Turso engine FAQ](https://github.com/tursodatabase/turso#faq) and [Turso Sync](https://docs.turso.tech/sync/usage)
