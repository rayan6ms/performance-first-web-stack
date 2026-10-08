# RateCraft

Initial public hourly-rate calculator: positive finite monthly income ÷ billable hours, entirely in the browser. No accounts, storage, backend API, or external credentials.

Use Bun 1.4.0 from this repository:

```sh
bun install --frozen-lockfile --network-concurrency 2
bun run dev
```

Development binds to `http://127.0.0.1:43104` and refuses occupied ports. Stop it with Ctrl+C.

```sh
bun run check
bun run build
HOST=127.0.0.1 PORT=43104 bun run start
```

The build pre-renders `/` in `.output/public/index.html` and prepares a Nitro Bun server in `.output/server/index.mjs`. `start` serves that actual production artifact; stop it with Ctrl+C. Use a different free port if 43104 is occupied. Build and test jobs are bounded to two where supported. No containers or secrets are required.

See [project instructions](AGENTS.md) and [decisions, checks, and readiness limits](docs/stack-decisions.md). Hosting, saved estimates, and PDF export remain deferred. The current Nitro v3 integration is a pinned beta. No deployment or traffic-capacity guarantee is implied by local checks.

## Published demo scope

This is a portable copy of frozen trial `aaba807`, assessed using source guidance `ff254aa`. It retains that historical policy and dependency versions; current guidance is distributed separately. See [assessment](../../assessment/REPORT.md), [prepared requirements](../../assessment/cases/04-ratecraft/brief.md), and [answers](../../assessment/cases/04-ratecraft/answers.md).

No secrets, dependency caches, build output, database volumes, or Git history are included. Historical results apply to the original host/state. Run the documented checks again on your environment. The interactive adapter is a pinned prerelease; review support before production use.

Demo code is MIT licensed; see [LICENSE](LICENSE). Dependencies and credited media retain their own terms.
