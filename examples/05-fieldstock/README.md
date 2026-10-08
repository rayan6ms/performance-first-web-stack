# FieldStock

Initial warehouse web foundation: SolidStart/Bun shell and Rust process-health API. No inventory records, authentication, persistence or stock actions.

See [project instructions](AGENTS.md) and [the decision/command record](docs/stack-decisions.md) for the selected stack, local run/stop commands, actual verification and required future questions.

Quick start (Bun 1.4.0 and Rust 1.97.1): `bun install --frozen-lockfile`, then run `bun run api:dev` and `bun run dev` in separate terminals. Open <http://127.0.0.1:45105>. Stop both with Ctrl+C. The trial host's rustup workaround is in the decision record.

## Published demo scope

This is a portable copy of frozen trial `05d39d5`, assessed using source guidance `ff254aa`. It retains that historical policy and dependency versions; current guidance is distributed separately. See [assessment](../../assessment/REPORT.md), [prepared requirements](../../assessment/cases/05-fieldstock/brief.md), and [answers](../../assessment/cases/05-fieldstock/answers.md).

No secrets, dependency caches, build output, database volumes, or Git history are included. Historical results apply to the original host/state. Run the documented checks again on your environment. The interactive adapter is a pinned prerelease; review support before production use.

Known historical defect: the retry control loses focus during its asynchronous disabled state. Its request/recovery works; this demo intentionally preserves the assessed implementation. Normally `cargo` from PATH suffices; the optional `FIELDSTOCK_RUST_BIN` override is only for a broken host proxy and must point to your installed toolchain.

Demo code is MIT licensed; see [LICENSE](LICENSE). Dependencies and credited media retain their own terms.
