# Specialist components and admission criteria

Use for selection of additional data/search/compute, build, infrastructure, networking, or isolation components. Apply the [core policy](../AGENTS.md) and the sections relevant to the affected boundary.

Apply [measurement requirements](performance.md) to performance/capacity claims and [tooling policy](tooling.md) to affected build/workflow changes.

## Advanced components and their admission criteria

Select these options when requirements/workloads justify their operating/resource cost; none is a prerequisite.

| Component | Selection trigger | Required evidence/design |
| --- | --- | --- |
| ClickHouse | High-volume columnar analytics | Query shape, ingest/load estimate, freshness, retention, backfill, recovery |
| DuckDB | Embedded/local/batch analytics | Memory/file bounds, concurrency model, data movement, execution measurements |
| ScyllaDB | High-throughput partition-oriented data | Partition/access model, hot-key strategy, consistency, repair/operations; explicit migration from relational semantics |
| Tantivy | Embedded Rust search | Index ownership, relevance, updates/deletion, memory, rebuild and serving concurrency |
| Meilisearch / Algolia | Typo-tolerant or managed product search | Relevance tests, freshness, deletion propagation, provider/index recovery |
| OpenSearch | Distributed search/aggregations | Shard/capacity model, memory, synchronization, relevance, operating owner |
| Redpanda / Kafka | Partitioned durable streams and replay | Partition/key ordering, consumer capacity, retention, failure/rebalance behavior |
| Cilium / Pixie | Required Kubernetes networking/policy/telemetry | Cluster/runtime compatibility, privileges, overhead, failure and rollback model |
| Envoy | Fine-grained origin/service traffic policy | Equivalent routing/load tests, retry budget, timeout/mTLS policy, operational ownership |
| Wasmtime / Spin | Sandboxed portable compute or plugin components | Allowed capabilities, resource/time limits, host interface, target support, measured overhead |
| Bazel + EngFlow / BuildBarn | Large polyglot build graph or valuable remote execution/cache | Cache hit rate, artifact/toolchain correctness, credentials, cost, end-to-end developer wait |
| Nix / Dev Containers | Reproducible system/toolchain environments | Supported host setup and usable developer workflow |
| OpenTofu | Managed infrastructure lifecycle | Protected state, reviewed plan, credentials, authorized apply, drift/recovery |
| Turborepo | Multiple JS packages with a useful task graph | Real package boundaries and measured cache/build benefit |
