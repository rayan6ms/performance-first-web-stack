# Identity and external providers

Use for OIDC/session flows, resource policy, external webhooks, payments/mail, or AI provider actions. Apply the [core policy](../AGENTS.md) and the sections relevant to the affected boundary.

## External providers

Integrate required payments/mail/AI/providers behind domain interfaces with maintained Rust SDKs or verified HTTP. Verify raw-body webhook signatures, deduplicate, protect transitions from out-of-order events, and reconcile provider state. Bound time, payload, concurrency, and cost; test reversed/duplicate stateful events. Authorize AI actions independently of model output. JavaScript examples do not require a JavaScript backend.

## Authentication and session policy

- Use mature OIDC flows with WorkOS, Auth0, Clerk, Cognito, or self-hosted Keycloak. Verify applicable issuer, audience, expiry, key rotation, and resource policies; do not invent token/password protocols.
- Authorize in Rust; test tenant isolation/denials. Add OpenFGA for relationships or Cedar for policy evaluation when needed; test consistency/availability.
- Secure browser cookies/session rotation, CSRF defenses, CORS, request limits, rate limits, secret management, and safe response/content headers. Treat URLs, uploads, redirects, and provider data as untrusted.

## Browser content and identity boundaries

Use escaped text/framework interpolation for ordinary content. Intentionally supported rich HTML needs a maintained, context-appropriate sanitizer at each rendering boundary, including SSR and email where applicable; browser-only sanitization cannot protect server output. Native `setHTML()` is an option when supported, with a verified sanitizer fallback and consistent rules. Avoid raw HTML sinks, regex sanitizers, and unsafe post-sanitization mutations.

CSP and Trusted Types add protection rather than replace sanitization. Verify framework/library cooperation and use a report-only rollout before enforcing a new policy. Validate redirect/message origins with parsed URLs and explicit trusted boundaries; same-site status or a hostname substring does not grant trust. Preserve mature identity/passkey-provider integrations instead of replacing them solely to call newer browser APIs. Consult Google's [security guides](https://github.com/GoogleChrome/modern-web-guidance/tree/main/skills/modern-web-guidance/guides/security) for the affected capability and [browser support policy](browser-platform.md#browser-support-and-native-behavior) for target checks.
