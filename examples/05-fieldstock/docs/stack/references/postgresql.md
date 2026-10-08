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

## Official documentation

Use documentation matching the installed version.

- [Axum](https://docs.rs/axum/latest/axum/), [Tokio](https://tokio.rs/), and [SQLx](https://github.com/launchbadge/sqlx)
