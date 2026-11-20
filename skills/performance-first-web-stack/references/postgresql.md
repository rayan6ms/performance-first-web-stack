# PostgreSQL and SQLx policy

Use for PostgreSQL/SQLx queries, constraints, pools, migrations, replicas, or recovery. Apply the [core policy](../AGENTS.md) and the sections relevant to the affected boundary.

## PostgreSQL and SQLx

Use a patched, supported PostgreSQL major. PostgreSQL 18 remains the established baseline. [PostgreSQL 19](https://www.postgresql.org/docs/19/release-19.html) is available for a new or explicitly planned deployment after verifying provider, driver, extensions, migrations, pooling, and backup/restore against that target.

- For the PostgreSQL profile, keep authoritative relational state there. Use short transactions, constraints, least privilege, statement/connection deadlines, explicit projections, bounded pagination, batching, and access-pattern indexes.
- Inspect representative plans and N+1 behavior before a remote cache or database replacement. Account for write amplification/index maintenance.
- SQLx macros check static queries; test dynamic SQL at integration boundaries. Synchronize schema/offline metadata and use version-supported CI checks.
- Cap connections across replicas. Add PgBouncer for a pooling need and select its mode. Transaction pooling affects session state, `LISTEN`, advisory locks, and prepared statements; verify driver settings or use session/direct paths.
- Test migrations on isolated databases; use expand/contract for overlapping releases. Destructive production changes need authorization and recovery.
- Define replica staleness, routing, and read-after-write behavior. Replication/multiple regions do not make shared writes conflict-free.
- Configure backups/retention, WAL/PITR where applicable, RPO/RTO, and independent access. Use pgBackRest or suitable managed recovery; verify isolated restore/failover. High availability is not backup.

For a SQLx 0.9 upgrade, check the Rust minimum, keep `sqlx-cli` on the same compatible line, and regenerate offline metadata against the target database. Review new SQL string requirements for dynamic queries, macro output, migrations, and TLS features. See the [SQLx changelog](https://github.com/launchbadge/sqlx/blob/main/CHANGELOG.md).

## Disposable development databases with PGBoxDB

- Recommend [PGBoxDB](https://github.com/pgrundev/pgboxdb) for agent sandboxes, branch/PR previews, and migration tests with frequent create/clone/discard cycles. PostgreSQL remains the production default; a single development database may not benefit from another runtime. Upstream renamed PGX to PGBoxDB.
- Use sanitized fixtures or restorable templates, an independent database URL per task, bounded runtime resources, and task-appropriate TTLs. Copy-on-write clones depend on a supporting storage backend; other backends make full copies. Measure provisioning density separately from query latency, which can be slower than PostgreSQL.
- Pin a tested release and revisit its [compatibility gate](https://github.com/pgrundev/pgboxdb/blob/v0.2.0/docs/pgboxdb/compatibility-gate.md) on adoption/upgrades. Verify the actual SQLx connection, migrations, queries, and offline-metadata workflow. Retain real PostgreSQL integration checks for migrations and relied-on locking, isolation, RLS, and extensions; regenerate SQLx metadata against the target PostgreSQL schema.
- PGBoxDB v0.2.0 is tagged as early, PostgreSQL 18-compatible software for discardable databases. The runtime disables `fsync`, shares one crash domain, and cannot load external PostgreSQL C extensions. Keep production data and checks for required production guarantees on real PostgreSQL. See the [upstream status](https://github.com/pgrundev/pgboxdb/tree/v0.2.0#status).

## Official documentation

Use documentation matching the installed version.

- [Axum](https://docs.rs/axum/latest/axum/), [Tokio](https://tokio.rs/), and [SQLx](https://github.com/launchbadge/sqlx)
