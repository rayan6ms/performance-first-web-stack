# Operation and delivery checks

Use for instrumentation, health/recovery, rollout, release/production preparation, or broader delivery validation. Apply the [core policy](../AGENTS.md) and the sections relevant to the affected boundary.

Use [architecture](architecture.md) for runtime/request-path changes, the selected database policy for migrations, and [measurement](performance.md) for performance claims.

## Observability and production operation

- Instrument service boundaries with compatible OpenTelemetry and correlated request/release context. Track relevant waits, errors, saturation, retries, allocation, lag, cache hits, and cost; bound cardinality/volume and redact secrets/personal data.
- Define service health/readiness, graceful shutdown/draining, compatible migration rollout, SLOs, error budgets, capacity limits, recovery, and rollback for the selected services.
- Prefer regional VMs/managed containers with suitable CDN/WAF. Use managed health-based balancing for failover/regional routing and Envoy for specific traffic policy. Mesh/Kubernetes need scheduling/isolation/organizational benefits that justify their costs.
- Prefer rolling releases; canary/blue-green suit stricter rollback/blast-radius needs.

## Verification and delivery gates

Use existing checks on affected packages and supported feature configurations; `--all-targets` does not cover every feature combination. New applications need discoverable Rust/frontend type, lint/format, build, and meaningful behavior checks for their selected components. Distinguish existing failures from regressions.

Test changed domain invariants, validation/authorization, error contracts, and critical journeys. Use real integration boundaries for affected databases/providers; test migration/recovery, delivery/replay, cancellation, and overload behavior when those paths change. Keep SQLx metadata and generated clients consistent with schema/contracts; macro checks do not cover dynamic SQL.

Use Vitest/Testing Library for relevant frontend tests and Playwright or available real-browser automation for critical journeys. Workers changes need a supported Workers environment; Bun-specific behavior needs Bun. Inspect changed UI and production bundles/runtime output when delivery behavior changes. Small content/style/accessibility edits may use direct inspection and existing checks without new test infrastructure.

Use isolated bounded fixtures without production secrets. Performance claims follow the [measurement policy](performance.md); report budget tradeoffs and unavailable telemetry. Complete implementation and fix its regressions, then broaden checks only for new changes, failures, or unresolved risks. Report blocked prerequisites rather than endlessly retrying.

Deliver the requested outcome; labeled prototypes are valid, but mocks/untested assumptions are not production evidence. Report behavior, material deviations, actual checks/measurements, and remaining limits. Commit when requested or required; pushing/publishing needs its own authorization.
