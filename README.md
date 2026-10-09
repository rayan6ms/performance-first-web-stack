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

Create or open your website's folder. With [Git](https://git-scm.com/downloads) and either [Bun](https://bun.com/docs/installation) or [Node.js 22.20+](https://nodejs.org/en/download) installed, run one of these commands inside that folder.

**Bun:**

```sh
bun x --bun skills@1.7.1 add https://github.com/rayan6ms/performance-first-web-stack/tree/v0.1.7 --skill performance-first-web-stack performance-first-web-stack-kickoff --copy
```

<details>
<summary>Node.js/npm</summary>

```sh
npx --yes skills@1.7.1 add https://github.com/rayan6ms/performance-first-web-stack/tree/v0.1.7 --skill performance-first-web-stack performance-first-web-stack-kickoff --copy
```

</details>

<details>
<summary>pnpm</summary>

Requires [pnpm](https://pnpm.io/installation) with Node.js.

```sh
pnpm dlx skills@1.7.1 add https://github.com/rayan6ms/performance-first-web-stack/tree/v0.1.7 --skill performance-first-web-stack performance-first-web-stack-kickoff --copy
```

</details>

Choose your coding agent when prompted, then open the same folder in your agent and ask:

```text
Use the performance-first-web-stack-kickoff skill to set up this directory.
It will be [describe your website and its main features].
```

The agent asks about your website, installs the needed tools, and prepares a starting project. Use the `performance-first-web-stack` skill for ongoing development.

For global or manual installation, and updates, see [installation options](docs/installation.md). Browse the [example projects](examples/README.md) to see different uses of the stack.

## License

[MIT](LICENSE).
