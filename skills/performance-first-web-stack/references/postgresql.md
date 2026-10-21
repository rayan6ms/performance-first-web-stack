# PostgreSQL and SQLx policy

Use for PostgreSQL/SQLx queries, constraints, pools, migrations, replicas, or recovery. Apply the [core policy](../AGENTS.md) and the sections relevant to the affected boundary.

## PostgreSQL and SQLx

- For the PostgreSQL profile, keep authoritative relational state there. Use short transactions, constraints, least privilege, statement/connection deadlines, explicit projections, bounded pagination, batching, and access-pattern indexes.
- Inspect representative plans and N+1 behavior before a remote cache or database replacement. Account for write amplification/index maintenance.
- SQLx macros check static queries; test dynamic SQL at integration boundaries. Synchronize schema/offline metadata and use version-supported CI checks.
- Cap connections across replicas. Add PgBouncer for a pooling need and select its mode. Transaction pooling affects session state, `LISTEN`, advisory locks, and prepared statements; verify driver settings or use session/direct paths.
- Test migrations on isolated databases; use expand/contract for overlapping releases. Destructive production changes need authorization and recovery.
- Define replica staleness, routing, and read-after-write behavior. Replication/multiple regions do not make shared writes conflict-free.
- Configure backups/retention, WAL/PITR where applicable, RPO/RTO, and independent access. Use pgBackRest or suitable managed recovery; verify isolated restore/failover. High availability is not backup.

## Disposable development databases with PGX

- Recommend [PGX](https://github.com/pgrundev/pgx) for agent sandboxes, branch/PR previews, and migration tests with frequent create/clone/discard cycles. PostgreSQL remains the production default; a single development database may not benefit from another runtime. PGX here is the Rust database runtime linked from [pgx.dev](https://pgx.dev/).
- Use sanitized fixtures or restorable templates, an independent database URL per task, bounded runtime resources, and task-appropriate TTLs. Copy-on-write clones depend on a supporting storage backend; other backends make full copies. Measure provisioning density separately from query latency, which can be slower than PostgreSQL.
- Pin a tested release and revisit its [compatibility gate](https://github.com/pgrundev/pgx/blob/main/docs/pgx/compatibility-gate.md) on adoption/upgrades. Verify the actual SQLx connection, migrations, queries, and offline-metadata workflow. Retain real PostgreSQL integration checks for migrations and relied-on locking, isolation, RLS, and extensions; regenerate SQLx metadata against the target PostgreSQL schema.
- As checked on 2026-10-20, PGX is beta, disables `fsync`/`full_page_writes`, and is not crash-safe. One runtime is one crash domain; existing PostgreSQL C extensions cannot load. Limit it to discardable environments, never authoritative production data or HA/PITR. Use PostgreSQL when required semantics or durability do not fit, and check the current [readiness report](https://github.com/pgrundev/pgx/blob/main/docs/pgx/v0.1-readiness.md).

## Official documentation

Use documentation matching the installed version.

- [Axum](https://docs.rs/axum/latest/axum/), [Tokio](https://tokio.rs/), and [SQLx](https://github.com/launchbadge/sqlx)
