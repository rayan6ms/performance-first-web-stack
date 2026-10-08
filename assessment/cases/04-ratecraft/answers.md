# RateCraft — prepared kickoff interview answers

## Product answers

**Who uses it and what should work now?** Freelancers enter target monthly income and billable hours. Initial calculation: positive finite inputs, estimated hourly rate = income divided by hours, readable validation and result. It needs no permanent storage or user identity.

**Public discovery and interaction?** Public shareable homepage and interactive form. The result updates locally; no server API or authoritative shared state is involved in this calculation. English UI; dollars are a displayed unit, not a payment transaction.

**Data and services?** No accounts, database, uploads, email, AI or backend domain service is required. No Rust service should be invented for client-only arithmetic.

**Performance target, hosting and scale?** Low initial JavaScript and responsive interaction are priorities. Hosting is likely a regional server behind a CDN; exact provider undecided. Perhaps 100,000 monthly visits, with bursts from social links. These are planning estimates, not evidence that special caching, Kubernetes or a load test is needed. Use the selected stack defaults that fit this scope.

**Browser/accessibility needs?** Current mainstream browsers, mobile and desktop. Labeled controls and keyboard submission should work, including invalid/zero inputs. A simple coherent UI is sufficient for kickoff; no large design system catalog.

**Deferred features?** Saved estimates and PDF export are possible later, not committed. If saved estimates become real, ask about local-only versus shared persistence before adding storage. No payment integration.

## Setup scope and operating constraints

**What should be ready now?** Prepare the essential initial repository, compatible tools/dependencies/configuration, a minimal runnable surface and persistent agent instructions. This is project kickoff, not a request to build the complete product. Implement only the initial behavior explicitly requested below; later product features should guide selection without speculative schemas or directories.

**Can you install and verify locally?** Yes: install project dependencies, generate the essential files, and run proportionate local checks. You may pull a required official image and use task-owned rootless Podman containers or an isolated local service. Keep install/build concurrency modest (two build jobs where supported); no stress tests, shared-runtime replacement, host-wide cleanup or termination of unrelated processes. Stop your owned verification services on completion and document how to restart them.

**Can you deploy or use accounts?** No remote provisioning, publishing, paid resources or production migrations. No provider account or credentials are supplied for this trial. Missing external access should be documented honestly. Keep local credentials outside committed instructions and browser code.

**Package/runtime preferences?** Prefer Bun for JavaScript/TypeScript; use pnpm if unsuitable and npm only if both are unsuitable. Rootless Podman before Docker; uv for Python.

**Repository?** The target is a local Git repository in the supplied test directory. Preserve existing files/instructions, commit the finished foundation in that repository, and leave useful continuation instructions. No push is requested.
