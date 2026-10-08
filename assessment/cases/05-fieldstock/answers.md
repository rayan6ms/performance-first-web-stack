# FieldStock — prepared kickoff interview answers

## Product answers

**Users and future capabilities?** Warehouse staff will view stock and record movements; supervisors will reconcile changes. Launch needs will include authenticated actions and authoritative backend validation. For this kickoff create only a web shell, a Rust service health endpoint and a verified frontend-to-health contract, not an inventory domain model or pretend working stock management.

**Data ownership and offline needs?** Whether scanners must write while disconnected is genuinely undecided. I cannot yet say whether there will be one central transactional owner or independently synchronized site data. There are no existing records to migrate. Preserve that unresolved decision and ask again before choosing/connecting persistence, writing domain schema/migrations or implementing stock changes. The independent web/Rust tooling and health connection can proceed.

**Authentication?** No identity provider is selected, and there are no credentials. Private data and stock mutations cannot be presented as authorized until identity and resource authorization are designed. The initial health endpoint can be public/local and must reveal no business data.

**Rendering/API ownership?** Interactive operations web UI plus an authoritative native backend, following the selected profile. Prefer a straightforward browser-to-Rust request path for this public health probe; no session/composition need currently justifies a separate forwarding backend.

**Initial contract?** A typed/validated health response and discoverable contract are enough now. The web shell should display a real health result or an honest unavailable state. Validate the setup with the API stopped as well as running; don't confuse a mock with a healthy service.

**Hosting, language and workload?** Regional deployment near warehouse data is the current assumption, with exact provider/region undecided. English UI; initially 3 warehouses and 30 concurrent staff, possibly 300 later. No measured bottleneck or need for multiple regions/message brokers yet. No live load test is requested.

**Other services?** No payments, background job system, uploads, analytics or infrastructure orchestration is required by this initial scope. Document how to run and stop the necessary local processes, preserving the pending data/auth choices.

## Setup scope and operating constraints

**What should be ready now?** Prepare the essential initial repository, compatible tools/dependencies/configuration, a minimal runnable surface and persistent agent instructions. This is project kickoff, not a request to build the complete product. Implement only the initial behavior explicitly requested below; later product features should guide selection without speculative schemas or directories.

**Can you install and verify locally?** Yes: install project dependencies, generate the essential files, and run proportionate local checks. You may pull a required official image and use task-owned rootless Podman containers or an isolated local service. Keep install/build concurrency modest (two build jobs where supported); no stress tests, shared-runtime replacement, host-wide cleanup or termination of unrelated processes. Stop your owned verification services on completion and document how to restart them.

**Can you deploy or use accounts?** No remote provisioning, publishing, paid resources or production migrations. No provider account or credentials are supplied for this trial. Missing external access should be documented honestly. Keep local credentials outside committed instructions and browser code.

**Package/runtime preferences?** Prefer Bun for JavaScript/TypeScript; use pnpm if unsuitable and npm only if both are unsuitable. Rootless Podman before Docker; uv for Python.

**Repository?** The target is a local Git repository in the supplied test directory. Preserve existing files/instructions, commit the finished foundation in that repository, and leave useful continuation instructions. No push is requested.
