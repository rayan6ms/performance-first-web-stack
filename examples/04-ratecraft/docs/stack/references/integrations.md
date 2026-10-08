# Identity and external providers

Use for OIDC/session flows, resource policy, external webhooks, payments/mail, or AI provider actions. Apply the [core policy](../AGENTS.md) and the sections relevant to the affected boundary.

## External providers

Integrate required payments/mail/AI/providers behind domain interfaces with maintained Rust SDKs or verified HTTP. Verify raw-body webhook signatures, deduplicate, protect transitions from out-of-order events, and reconcile provider state. Bound time, payload, concurrency, and cost; test reversed/duplicate stateful events. Authorize AI actions independently of model output. JavaScript examples do not require a JavaScript backend.

## Authentication and session policy

- Use mature OIDC flows with WorkOS, Auth0, Clerk, Cognito, or self-hosted Keycloak. Verify applicable issuer, audience, expiry, key rotation, and resource policies; do not invent token/password protocols.
- Authorize in Rust; test tenant isolation/denials. Add OpenFGA for relationships or Cedar for policy evaluation when needed; test consistency/availability.
- Secure browser cookies/session rotation, CSRF defenses, CORS, request limits, rate limits, secret management, and safe response/content headers. Treat URLs, uploads, redirects, and provider data as untrusted.
