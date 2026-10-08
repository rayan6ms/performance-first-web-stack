# Performance measurement policy

Use for material performance claims, benchmark design, capacity evaluation, or architecture replacements. Apply the [core policy](../AGENTS.md) and the sections relevant to the affected boundary.

## Performance measurement requirements

For a material performance claim or architecture replacement, record the relevant workload, baseline, method, and outcome. A visual-only fix needs visual checks; a browser bundle claim needs browser/bundle measures, not an unrelated backend benchmark. For service/capacity claims, use the applicable measures below:

- Workload and data: endpoint/query behavior, dataset/indexes, payload distribution, read/write mix, concurrency/arrival rate, hot keys, and cache state.
- Environment: hardware/resources, regions/network, release/toolchain versions, build mode, middleware, pool/queue limits, and durability/consistency settings.
- Results: applicable latency percentiles, sustained throughput, errors/dropped work, CPU/memory, network bytes, and pool/queue/query wait. Unavailable measures must be disclosed, not fabricated.
- Boundaries: report distinct endpoint/journey percentiles for differing workloads. Separate async submission/ack latency from completion latency/throughput; aggregates or quick enqueue responses must not hide slow required operations.
- Method: warmup, duration, repeat runs, startup/cold behavior where relevant, generator capacity, and whether request scheduling hides overload/queueing. Keep comparisons equivalent and disclose limitations.

Compare equivalent production-like artifacts and correctness/durability/middleware settings. Include failures and completed work; use authorized isolated environments for load tests. Required security/correctness controls can increase latency: evaluate against agreed budgets and disclose the tradeoff instead of removing them to win a benchmark.

Profile the affected path and address its dominant costs: unnecessary work/hops, data distance, safe caching, bytes/execution/copying, queries/batching, or contention/allocation. Prefer removing work before adding runtime/infrastructure complexity; no fixed optimization sequence is required.

For non-baseline choices, record the metric/requirement, alternatives, benchmark/capacity evidence, owner, failures, data lifecycle, and removal path; revisit as workloads change.
