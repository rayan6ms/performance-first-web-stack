# Performance-First Web Stack

[![Release](https://img.shields.io/github/v/release/rayan6ms/performance-first-web-stack)](https://github.com/rayan6ms/performance-first-web-stack/releases/latest)
[![CI](https://github.com/rayan6ms/performance-first-web-stack/actions/workflows/check.yml/badge.svg)](https://github.com/rayan6ms/performance-first-web-stack/actions/workflows/check.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A web stack built around Solid and Rust for low latency, high throughput, and predictable resource use—bundled with modular coding-agent skills that scaffold new projects and enforce measured performance as they grow.

A good fit for latency-sensitive APIs, high-traffic websites, and applications with demanding backend workloads.

## The stack

| Layer | Recommendation |
| --- | --- |
| Web UI | [Solid 2 (Start mode)](https://docs.solidjs.com/concepts/rendering-and-ssr/) or [SolidStart 2 with Solid 1](https://github.com/solidjs/solid-start) for SSR |
| Backend | [Rust](https://www.rust-lang.org/) + [Axum](https://docs.rs/axum/latest/axum/) + [Tokio](https://tokio.rs/) + Tower |
| API contract | [OpenAPI](https://www.openapis.org/) (`utoipa` / `aide`) with generated clients ([openapi-typescript](https://openapi-ts.dev/)) |
| Database | [PostgreSQL](https://www.postgresql.org/) + [SQLx](https://github.com/launchbadge/sqlx) |
| Browser validation | [Valibot](https://valibot.dev/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4 or CSS Modules/native CSS; [StyleX](https://stylexjs.com/) for shared token design systems |
| Tooling | Cargo (`cargo-nextest`), [Bun](https://bun.com/), [Vite](https://vite.dev/), [Oxlint + Oxfmt](https://oxc.rs/) |
| Hosting | Regional VMs or managed containers near the database, with CDN delivery |

Also includes dedicated profiles for **Astro** (content sites), **Turso** (embedded/tenant data), **Marko** (streaming/resumability), **Leptos** (full-stack Rust UI), and **HTMX** (Axum server-rendered HTML). Add caches (Valkey), queues (NATS JetStream), and distributed services when measured workloads justify them. The [stack guide](docs/stack.md) covers data ownership, images, authentication, deployment, quality checks, and performance measurement.

## How the skills work

- **Project kickoff (`performance-first-web-stack-kickoff`):** Interviews you on workload and requirements, scaffolds only what you need, verifies both Rust and frontend builds, and writes a durable decision record (`docs/stack-decisions.md`) plus a local policy snapshot (`docs/stack/`).
- **Modular ongoing guidance (`performance-first-web-stack`):** Uses a compact core `AGENTS.md` that routes to task-specific references (Rust concurrency, SQLx/Turso, rendering profiles, benchmarking, specialist components) instead of loading the entire catalog into context.
- **On-demand companion skills:** Routes design (`impeccable`, `frontend-design`), browser platform (`modern-web-guidance`), component (`ui-sdk`), and security (`security-audit`) tasks through `performance-stack skill`—installed only when needed.
- **Offline-capable CLI:** Bundles both skills, guards local customizations on updates, supports global or `--local` installs, and removes cleanly.

## Use with your agent

With [Bun](https://bun.com/docs/installation) and [Git](https://git-scm.com/downloads), run:

```sh
bun x --bun github:rayan6ms/performance-first-web-stack#v0.1.19
```

<details>
<summary>curl, npm or pnpm</summary>

With curl and either Bun or Node.js 22+ (Linux/macOS):

```sh
curl -fsSL https://raw.githubusercontent.com/rayan6ms/performance-first-web-stack/v0.1.19/install.sh | sh
```

With Node.js 22+ and Git:

```sh
npx --yes github:rayan6ms/performance-first-web-stack#v0.1.19
```

With pnpm, Node.js 22+ and Git:

```sh
pnpm dlx github:rayan6ms/performance-first-web-stack#v0.1.19
```

</details>

Setup installs the CLI and both skills globally. Works with **Claude Code, Codex, Cursor, GitHub Copilot, OpenCode, Windsurf, Gemini CLI, Antigravity**, and 70+ other agents (pass `--agent <id>` to skip the picker, or run `performance-stack init --local` for project-local skills).

Then open your website directory in your agent and ask:

```text
Use the performance-first-web-stack-kickoff skill to set up this directory.
It will be [describe your website and its main features].
```

Use `performance-first-web-stack` for ongoing development once the foundation is ready.

## Documentation

[Stack guide](docs/stack.md) · [Installation and updates](docs/installation.md) · [Example projects](examples/README.md) · [Assessment](assessment/REPORT.md) · [Changelog](CHANGELOG.md)

## License

[MIT](LICENSE).
