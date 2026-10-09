# Performance-First Web Stack

A web stack built around Solid and Rust for low latency, high throughput, and efficient resource use. Includes skills that help your coding agent set up a project and follow the stack as it grows.

A good fit for latency-sensitive APIs, high-traffic websites, and applications with demanding backend workloads.

## The stack

| Layer | Recommendation |
| --- | --- |
| Web UI | [SolidJS + SolidStart](https://docs.solidjs.com/solid-start/v2) |
| Backend | Rust + Axum + Tokio + Tower |
| API contract | OpenAPI with generated clients |
| Database | PostgreSQL + SQLx |
| Browser validation | Valibot |
| Styling | StyleX for a shared design system; CSS Modules or native CSS for simpler UI |
| Tooling | Bun, Vite, Oxlint, Oxfmt |
| Hosting | Regional VMs or managed containers near the database, with CDN delivery |

Use Astro for content sites. Add caches, queues, and distributed services when the workload needs them. The [stack guide](docs/stack.md) covers data ownership, images, authentication, deployment, and performance measurement.

## Use with your agent

With [Bun](https://bun.com/docs/installation) and [Git](https://git-scm.com/downloads), run:

```sh
bun x --bun github:rayan6ms/performance-first-web-stack#v0.1.10
```

<details>
<summary>curl, npm or pnpm</summary>

With curl and either Bun or Node.js 22+ (Linux/macOS):

```sh
curl -fsSL https://raw.githubusercontent.com/rayan6ms/performance-first-web-stack/v0.1.10/install.sh | sh
```

With Node.js 22+ and Git:

```sh
npx --yes github:rayan6ms/performance-first-web-stack#v0.1.10
```

With pnpm, Node.js 22+ and Git:

```sh
pnpm dlx github:rayan6ms/performance-first-web-stack#v0.1.10
```

</details>

Setup installs the CLI and both skills globally. Choose from a sorted, searchable list, or open **Other agents** in the same picker.

Then open your website in your agent and ask:

```text
Use the performance-first-web-stack-kickoff skill to set up this directory.
It will be [describe your website and its main features].
```

The agent asks about your website and prepares a starting project. For project-local skills, run `performance-stack init --local`. Use `performance-first-web-stack` for ongoing development.

[Installation options](docs/installation.md) · [Example projects](examples/README.md)

## License

[MIT](LICENSE).
