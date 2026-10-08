# Kickoff trial assessment

This product includes 2 scenarios from the original five-scenario assessment on 2026-10-08. Their local foundations passed applicable install, type/lint/format, production build/startup, and relevant browser/service checks. These published copies preserve the original application code and policy, with host paths and publication notes adapted as listed in [demo provenance](demo-provenance.json).

| Demo | Local-foundation score | Finding |
| --- | --- | --- |
| [RateCraft](../examples/04-ratecraft/README.md) | 10/10 | Real local arithmetic and input recovery verified; 8,693 bytes gzip with Bun node:zlib defaults. |
| [FieldStock](../examples/05-fieldstock/README.md) | 9.5/10 | Actual health/failure/restart contract works; disabling retry during a probe drops keyboard focus to BODY. |

## Method and evidence

The original experiment used frozen source revision `ff254aae09cd3cee626c39f07767d4e8f559e108`, GPT 6.1 Sol with high reasoning, and prepared product answers. Five scenarios needed seven dispatches because two were cancelled externally and resumed. This product's subset used 2 dispatches for 2 scenarios. The cancellation cause is unknown. No evaluator repairs were applied to the original websites, and the source guidance was revised only after the assessment.

[Scores](scores.json) follow the [predeclared rubric](RUBRIC.md). [Command results](check-summary.json) record 18 passing command executions in this subset; expected failure probes can correctly have a nonzero exit status. These are executions, not counts of distinct tests. Prepared [briefs and answers](cases/) and browser/HTTP evidence are included for these cases. Agent traces, credentials, host tooling, volumes, raw environment inventories, and dependency caches are not distributed.

The scored outputs used frozen local guidance and retained selected defaults, complete policy snapshots, stable deferred IDs, explicit blocked scopes, and chosen-versus-verified distinctions. That demonstrates instruction use, but the prepared answers also influenced selection. There was no control group, so causal improvement cannot be quantified. The interview itself and fresh-agent continuation were not tested.

## Scope and known limits

The installs passed on an existing Linux/Bun 1.4.0 host and cache. This was not a clean-machine or cross-platform certification. Interactive foundations use a documented pinned Nitro prerelease; passing local checks does not establish production support. No deployment, traffic capacity, field Core Web Vitals, auth/payment behavior, or complete application is claimed.

RateCraft verified arithmetic, validation/recovery, keyboard submission and a small compressed client artifact; hosting/persistence/export remain pending. FieldStock verified real Rust health/failure/restart and contract drift but has a retry-focus defect: disabling its button while probing moves focus to BODY. Data ownership, authentication and inventory writes remain pending. The defect is retained to keep historical findings honest.

## Improvements informed by this assessment

Current product guidance checks focus after asynchronous transitions, recommends a documented verification command with clear coverage, puts readiness/commands/open IDs first in the durable record, assesses required prereleases explicitly, and stamps release provenance. Published demos remain historical evidence, not proof that the revised guidance fixes every future agent's behavior.

Publication checks passed 15 recorded install/build/code commands and the relevant production startup/HTTP smoke checks on the relocated copies; see [publication results](publication-checks.json). These are separate from the historical scores. The package also passed isolated Skills CLI discovery/copy installation for Codex and Claude Code, package routing/provenance tests, and plugin manifest schema validation. See [installation options](../docs/installation.md). Future evaluation should cover a live incomplete interview, a fresh continuation agent, clean-environment installation, and a matched control if causal effect is the question.

The publication smoke initially assumed a missing UI route would always return 404. RateCraft's single-page fallback returns 200, so the corrected check verifies its homepage and built assets; it does not claim missing-route behavior. No application code was changed for that evaluator assumption.
