# Toolchains, builds, and native Bun APIs

Use for dependency/build/CI configuration, Rust features/MSRV, frontend toolchains, or native Bun-owned operations. Apply the [core policy](../AGENTS.md) and the sections relevant to the affected boundary.

Select specialist build/infrastructure components using their [admission criteria](advanced.md); their presence in the catalog does not require adoption.

## Toolchain and version discipline

- Verify changed/selected APIs and compatibility using installed code/types or matching official docs, including adapters, StyleX compiler, Bun, Rust MSRV/features, and database/extensions. Disclose gaps rather than inventing support.
- Prefer supported stable compatible release combinations, patched releases, and pinned local tools/toolchains. If a needed integration requires a prerelease, establish its purpose, target/version support limits, and validation/fallback before selection; pin it and record those limits. Local checks do not establish production support. Resolve incompatibility within the affected version/adapter boundary before considering a wider change. Experimental features also need a purpose, risk, and test/fallback.
- Use Cargo/JS lockfiles and one JS package manager per workspace; locked builds require lockfiles. Preserve working tools for unrelated fixes.
- Bun is the tooling default where suitable. Use it explicitly for compatible scripts; `--bun` overrides Node shebangs but does not fix incompatibility. Another runtime needs a verified unmet Bun requirement; upstream compatibility metadata alone does not justify it. pnpm manages packages, not application execution. Fetch missing tools at verified versions.
- Use Cargo for Rust and a separate frontend TypeScript check; transpilation/Oxlint do not replace it. Do not suppress errors to pass checks.
- Prefer rootless Podman, Docker when unsuitable, and `uv` for Python. Bound build resources to the host.

When type checking fails in third-party declarations, first inspect compatible dependency versions and separate those diagnostics from authored errors. If needed, document `skipLibCheck` in the smallest affected configuration; it skips declaration-file checking, not checking of authored code against imported APIs. Retain strict application, configuration, and test checks and verify their coverage. Record the vendor-check limitation rather than masking authored errors or installing unused optional integrations.

For new foundations, expose one documented `verify` command covering applicable non-mutating frontend types, Rust checks, lint/format, meaningful local tests, and contract checks; retain a suitable existing equivalent. Keep individual checks available and propagate failures. Builds, code generation that updates source, live-service checks, migrations, and deployment remain explicit commands. Do not add no-op checks or test infrastructure just to fill the umbrella.

## Native Bun capabilities

CONDITIONAL: use `Bun.S3Client` for S3/R2/presigning, `Bun.SQL` for PostgreSQL/MySQL/SQLite, or `Bun.markdown` for simple content in existing/required Bun-owned work or build tools. Keep authoritative domain data/access in Rust/SQLx; do not add a Bun hop to use these APIs. Preserve schemas/migrations; local SQLite is not Turso. Check Markdown API maturity, sanitize untrusted HTML, and use HTML/custom rendering for Solid rather than its React renderer. Bun APIs do not run in browsers, Workers, or Rust; use native clients/bindings there.

## Platform workflow tools

Use Just/direnv, SOPS with age, GitHub Actions, Renovate, Release Please, Trivy, `cargo-audit`, and `cargo-deny` for required workflows. Nix, Bazel, and JS orchestrators need distinct roles; scans/infrastructure policy must match deployment.

## Official documentation

Use documentation matching the installed version.

- [Bun runtime and APIs](https://bun.com/docs/runtime)
- [TypeScript skipLibCheck](https://www.typescriptlang.org/tsconfig/skipLibCheck.html)
