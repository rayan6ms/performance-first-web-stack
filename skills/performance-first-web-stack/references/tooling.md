# Toolchains, builds, and native Bun APIs

Use for dependency/build/CI configuration, Rust features/MSRV, frontend toolchains, or native Bun-owned operations. Apply the [core policy](../AGENTS.md) and the sections relevant to the affected boundary.

Select specialist build/infrastructure components using their [admission criteria](advanced.md); their presence in the catalog does not require adoption.

For Knip, Astro diagnostics, and applicable audit tooling, follow [website quality checks](quality.md).

Selected Marko/Leptos/HTMX foundations also follow their [rendering profile](rendering-profiles.md), including template checks, formatter coverage, and separate native/WASM builds where applicable.

## Toolchain and version discipline

- Verify changed/selected APIs and compatibility using installed code/types or matching official docs, including adapters, StyleX compiler, Bun, Rust MSRV/features, and database/extensions. Disclose gaps rather than inventing support.
- Prefer supported stable compatible release combinations, patched releases, and pinned local tools/toolchains. If a needed integration requires a prerelease, establish its purpose, target/version support limits, and validation/fallback before selection; pin it and record those limits. Local checks do not establish production support. Resolve incompatibility within the affected version/adapter boundary before considering a wider change. Experimental features also need a purpose, risk, and test/fallback.
- Use Cargo/JS lockfiles and one JS package manager per workspace; locked builds require lockfiles. Preserve working tools for unrelated fixes.
- Bun is the tooling default where suitable. Use it explicitly for compatible scripts; `--bun` overrides Node shebangs but does not fix incompatibility. Another runtime needs a verified unmet Bun requirement; upstream compatibility metadata alone does not justify it. pnpm manages packages, not application execution. Fetch missing tools at verified versions.
- Use Cargo for Rust and a separate frontend TypeScript check; transpilation/Oxlint do not replace it. Do not suppress errors to pass checks.
- Prefer rootless Podman, Docker when unsuitable, and `uv` for Python. Bound build resources to the host.

When type checking fails in third-party declarations, first inspect compatible dependency versions and separate those diagnostics from authored errors. If needed, document `skipLibCheck` in the smallest affected configuration; it skips declaration-file checking, not checking of authored code against imported APIs. Retain strict application, configuration, and test checks and verify their coverage. Record the vendor-check limitation rather than masking authored errors or installing unused optional integrations.

For new foundations, expose one documented `verify` command covering applicable non-mutating frontend types, Rust checks, lint/format, meaningful local tests, and contract checks; retain a suitable existing equivalent. Keep individual checks available and propagate failures. Builds, code generation that updates source, live-service checks, migrations, and deployment remain explicit commands. Do not add no-op checks or test infrastructure just to fill the umbrella.

## Build and CI performance

- Measure end-to-end wait and the critical path through checkout, installation, Rust/frontend compilation, test setup/execution, and cache transfer. Optimize the dominant cost; faster CI does not establish lower request latency or browser cost.
- Cache reproducible tasks when reuse justifies transfer/storage costs; declare inputs/outputs, lockfiles, toolchain versions, build-affecting environment, and relevant OS/architecture/target/features. Measure restore/save cost and cache misses. Do not cache external mutations or persistent tasks; exclude secrets/private data from artifacts and logs.
- Parallelize independent tasks within CPU/memory limits, accounting for Cargo and frontend worker pools together; sequence generators before consumers. Use affected-task support in the selected build graph only when it includes dependents and shared configuration/lockfile changes. If the graph or base/head history cannot establish the affected set, run the full applicable checks; a JS graph alone does not cover Rust/contract changes.
- Consider partial/blobless clones only when checkout is expensive, accounting for lazy fetches. They differ from shallow history: preserve the commits/merge base needed for affected checks and versioning.
- Keep Vitest file isolation by default. Disable it only for selected suites after checking shared module/global/DOM state, cleanup, and order dependence, and measuring the benefit. Follow the installed version's [performance guidance](https://vitest.dev/guide/improving-performance.html).
- Choose larger/faster runners, including providers such as Blacksmith, when timings and cost justify them. Optional project-scoped pre-push hooks should run quick targeted checks; required validation remains in CI, since hooks can be bypassed. Preserve existing hook tooling.

## TypeScript checking and faster feedback

- For new compatible foundations, prefer built-in [Bun type checking](https://bun.com/docs/runtime/check) using a pinned supporting Bun release. Check its bundled TypeScript baseline against the framework, configs, and editor; installing another `typescript` version does not change Bun's checker. Retain supported official TypeScript when compatibility requires it; changing language versions solely for speed is not a prerequisite.
- Expose a project-wide frontend `typecheck` script such as `bun check --no-script -p tsconfig.json`; use `-b` when all referenced projects need checking. `--no-script` prevents a package's `check` script from shadowing the checker. Include application, configuration, and test code in the selected configs; entry-point or staged-file checks can miss other affected code. Bound concurrency with supported options such as `--threads 2`, adjusted to the host.
- Before replacing an authoritative checker, compare file coverage, diagnostics, and failure exits with supported official TypeScript on representative valid/invalid project code, including references where used. Keep the existing check authoritative until compatibility is established. Retain framework checks such as `astro check` and selected template diagnostics. Bun check emits neither declarations nor `.tsbuildinfo`; keep required emit/code-generation and editor tooling. Recheck relevant coverage after upgrades and measure actual wait/memory.
- Use [tsrs](https://github.com/oxc-project/tsrs) as an alternative local accelerator when its tested compatibility and measured benefit justify another tool. Check its [compatibility report](https://github.com/oxc-project/tsrs/blob/main/docs/COMPATIBILITY.md), pin it, and expose a separate script such as `types:fast` running `tsrs --noEmit -p tsconfig.json`, adapted to the actual configs. Retain the accepted project-wide type and framework checks in `verify`/CI when adding experimental tsrs feedback; do not install overlapping accelerators by default. Isolate incremental caches between compilers where needed.

## Rust development acceleration: rustd

- Use [rustd](https://github.com/DioxusLabs/rustd) as an experimental local accelerator for repeated Rust builds on a supported host. Before adoption or upgrades, recheck upstream status, platform support, and the exact compatible Rust toolchain/`rust-src`; pin the tested combination. Keep its binaries together and prefer explicit `cargo rustd build` / `cargo rustd run` commands over enabling a user-wide Cargo wrapper.
- As checked on 2026-10-20, daemon builds lack borrow checking and have known correctness gaps. Run a real rustc-backed check before executing changed daemon-built code. Keep standard Cargo/rustc checks, Clippy, tests, and release builds authoritative in `verify`/CI, bypassing a configured rustd wrapper; on supported POSIX hosts, `RUSTC_WORKSPACE_WRAPPER= cargo check --workspace --all-targets` clears that workspace wrapper. Keep verification artifacts separate from daemon-patched executables where needed.
- Reproduce daemon errors or unexpected behavior with ordinary Cargo; switch the affected workflow back to Cargo when compatibility/correctness fails. Do not suppress compiler errors or assume the daemon automatically falls back. Re-evaluate these restrictions only when the selected release's support and project checks justify it.
- Bound daemon memory, cache storage, and build concurrency alongside other tools. It may serve several projects/worktrees; do not stop a shared daemon or rewrite global Cargo configuration as routine project cleanup. Measure warm rebuild gains and cold-start/resource costs on the actual project.

## Native Bun capabilities

CONDITIONAL: use `Bun.S3Client` for S3/R2/presigning, `Bun.SQL` for PostgreSQL/MySQL/SQLite, or `Bun.markdown` for simple content in existing/required Bun-owned work or build tools. Keep authoritative domain data/access in Rust/SQLx; do not add a Bun hop to use these APIs. Preserve schemas/migrations; local SQLite is not Turso. Check Markdown API maturity, sanitize untrusted HTML, and use HTML/custom rendering for Solid rather than its React renderer. Bun APIs do not run in browsers, Workers, or Rust; use native clients/bindings there.

## Platform workflow tools

Use Just/direnv, SOPS with age, GitHub Actions, Renovate, Release Please, Trivy, `cargo-audit`, and `cargo-deny` for required workflows. Nix, Bazel, and JS orchestrators need distinct roles; scans/infrastructure policy must match deployment.

## Official documentation

Use documentation matching the installed version.

- [Bun runtime and APIs](https://bun.com/docs/runtime)
- [TypeScript skipLibCheck](https://www.typescriptlang.org/tsconfig/skipLibCheck.html)
