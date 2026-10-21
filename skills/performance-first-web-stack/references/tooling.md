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

## Development accelerators

### TypeScript: tsrs

- Recommend [tsrs](https://github.com/oxc-project/tsrs) for fast local frontend TypeScript feedback in compatible projects. Before adoption or upgrades, check the current release's TypeScript baseline, [supported features](https://github.com/oxc-project/tsrs/blob/main/docs/COMPATIBILITY.md), host binaries, and framework/configuration fit; pin a tested version as a development dependency. Resolve current gaps rather than assuming upcoming fixes are available.
- Expose a separate local script such as `types:fast` running `tsrs --noEmit -p tsconfig.json`, invoked with `bun run --bun types:fast`; adapt it to the actual configs/project references. Keep supported official TypeScript and framework checks, including `astro check` where applicable, in `verify` and CI while tsrs is experimental. Do not replace emit/code generation or editor integrations merely to add faster checking.
- Compare file coverage, diagnostics, and failure exit codes against the project's official checks on representative valid/invalid code before relying on local results; repeat after upgrades. Isolate incremental caches between compilers where necessary and bound checker threads/memory using version-supported options. Measure actual developer wait and memory rather than adopting benchmark multipliers as guarantees.

### Rust: rustd

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
