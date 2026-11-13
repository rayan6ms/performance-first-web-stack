# Performance measurement policy

Use for material performance claims, benchmark design, capacity evaluation, or architecture replacements. Apply the [core policy](../AGENTS.md) and the sections relevant to the affected boundary.

For Lighthouse CI, WebPageTest, and field Core Web Vitals collection, use [website quality checks](quality.md).

## Performance measurement requirements

For a material performance claim or architecture replacement, record the relevant workload, baseline, method, and outcome. A visual-only fix needs visual checks; a browser bundle claim needs browser/bundle measures, not an unrelated backend benchmark. For service/capacity claims, use the applicable measures below:

- Workload and data: endpoint/query behavior, dataset/indexes, payload distribution, read/write mix, concurrency/arrival rate, hot keys, and cache state.
- Environment: hardware/resources, regions/network, release/toolchain versions, build mode, middleware, pool/queue limits, and durability/consistency settings.
- Results: applicable latency percentiles, sustained throughput, errors/dropped work, CPU/memory, network bytes, and pool/queue/query wait. Unavailable measures must be disclosed, not fabricated.
- Boundaries: report distinct endpoint/journey percentiles for differing workloads. Separate async submission/ack latency from completion latency/throughput; aggregates or quick enqueue responses must not hide slow required operations.
- Method: warmup, duration, repeat runs, startup/cold behavior where relevant, generator capacity, and whether request scheduling hides overload/queueing. Interleave or randomize baseline/candidate order and report absolute changes and variability. Keep comparisons equivalent and disclose limitations.
- Pipeline cost: include construction, packing/conversion, copying, serialization, cleanup, and peak memory where affected. Measure across relevant processing stages, accounting for how often each cost is paid and amortized; a faster inner loop can still increase total cost.
- Benchmark validity: compare the same logical inputs and required outputs/semantics against the baseline. Reset mutated fixtures between samples and keep benchmark reporting outside timed regions. For CPU microbenchmarks, use runtime inputs and suitable optimizer barriers against constant folding or eliminated work; consuming a checksum alone does not establish that the intended work ran.

Compare equivalent production-like artifacts and correctness/durability/middleware settings. Include failures and completed work; use authorized isolated environments for load tests. Required security/correctness controls can increase latency: evaluate against agreed budgets and disclose the tradeoff instead of removing them to win a benchmark.

Retain the baseline when gains are inconclusive or do not justify added complexity. Label proxy-hardware results and limit claims to the measured conditions; defer claims of a target-hardware winner until representative validation is available.

Profile the affected path and address its dominant costs: unnecessary work/hops, data distance, safe caching, bytes/execution/copying, queries/batching, or contention/allocation. Prefer removing work before adding runtime/infrastructure complexity; no fixed optimization sequence is required.

Efficient design and caching can complement each other. Retain useful HTTP/CDN/application caching with deliberate freshness, invalidation, and authorization; compare cold/miss and warm/hit behavior and account for cache memory and coordination costs. Follow the [data-service policy](data-services.md) for application caches.

For material non-baseline choices, record the requirement or expected gain, alternatives, supporting evidence, tradeoffs, and validation. Added services also need ownership, failure behavior, data lifecycle, and a removal path; revisit affected decisions as workloads change.

## Rust data layout and allocation

Use these options for profiled Rust hot paths where layout may improve allocation, copying, memory access, or vectorization. Compare release builds on representative sizes and access/mutation patterns; retain changes whose latency/throughput or memory benefit justifies their complexity. They do not prescribe a rewrite of I/O-bound web handlers or JavaScript collections.

- Compare contiguous `Vec`/slice storage with hash maps when IDs are dense or iteration dominates; retain keyed structures for access patterns they serve well. Include mapping, insertion, deletion, and spare-capacity costs. Index handles need a validity model across removal, `swap_remove`, and slot reuse; use generations or another checked identity scheme where stale handles can survive.
- Compare structure-of-arrays for repeated scans over selected fields with array-of-structures for operations consuming whole records. Account for keeping columns aligned and for update costs; use the access pattern rather than a universal layout preference.
- For mixed access, consider separating frequently used fields from cold payloads, or blocked array-of-structures-of-arrays (AoSoA: small blocks of SoA) for useful locality/vectorization. Compare tile sizes and tail handling on relevant targets. Alignment/padding can increase footprint; use it when measurements justify it rather than assigning every record a cache line.
- Consider suitable borrowing, reuse, or capacity reservation to reduce repeated allocation/copying. For short collections, evaluate [SmallVec](https://docs.rs/smallvec/latest/smallvec/struct.SmallVec.html) with a measured inline capacity or [ArrayVec](https://docs.rs/arrayvec/latest/arrayvec/struct.ArrayVec.html) with a real hard bound and handled overflow. SmallVec can spill to the heap. Inline storage lives inside its containing value, which can itself be heap allocated; larger capacities also increase object/async-future size and possible stack pressure.
- Consider bitsets for large dense flag collections or useful bulk set operations. Compare access/update cost, sparsity, and synchronization needs; ordinary booleans remain valid for small collections and independent fields.
- Pack flags into spare index bits only for a demonstrated benefit, with explicit bit widths, capacity/overflow bounds, checked encoding/decoding, and handle-validity tests. Preserve external ID/wire contracts. JavaScript number bitwise operations use 32-bit integers; do not transfer Rust integer-packing assumptions to TypeScript.

Use safe representations and APIs by default. These choices do not justify removing bounds/authorization checks or adding `unsafe` without the [Rust implementation policy](backend.md).
