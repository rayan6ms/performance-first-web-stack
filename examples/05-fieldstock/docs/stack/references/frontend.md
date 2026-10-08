# Frontend, accessibility, and images

Use for Solid UI/state/forms, rendering/accessibility, browser budgets, or image processing/delivery. Apply the [core policy](../AGENTS.md) and the sections relevant to the affected boundary.

For a material performance claim, use the [measurement policy](performance.md); upload ownership uses [data services](data-services.md).

## Frontend quality and browser budgets

- Deliver a coherent responsive interface suited to the product/brand, with working controls, relevant loading/empty/error/success/denied states, and recoverable input.
- Use StyleX for shared tokens when useful; verify compiler and Solid-compatible `stylex.attrs` in production SSR, lazy routes, hydration, themes, and extracted CSS. Otherwise prefer CSS Modules/native CSS.
- Use Kobalte or Ark UI Solid primitives with correct focus/keyboard semantics. Aim for WCAG 2.2 AA; verify contrast, labels, reduced motion, zoom/reflow, and manual keyboard use beyond automated scans.
- Keep local interaction in signals/stores and persistent data in route/server state. Add a remote cache for required refetch, optimistic update, or offline behavior; do not duplicate every response in a global store.
- Use native forms/actions where supported, with appropriate Valibot client validation. Validate and authorize server-bound requests in Rust when a backend is needed; local-only calculators do not require one. Keep locale and private SSR state isolated by request/tenant.
- Minimize critical-route bytes/execution through route splitting, responsive images with stable dimensions, font subsets, prompt LCP discovery, and deferred optional libraries. Prefer compositor-friendly animation and virtualize expensive lists without losing accessibility.
- For a public critical route, use a provisional budget of under 100 KiB compressed JavaScript and LCP under 2 s on a documented lab profile, unless product requirements justify a different budget. This is a project engineering target, not a universal guarantee.
- Track Core Web Vitals at the 75th percentile of field data: good thresholds are LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1; verify definitions before publishing. Label lab measurements separately and measure hydration/execution as well as transfer size.

## Images and delivery

- Prefer reusable build/upload variants with CDN delivery where feasible. Choose cached on-demand transforms when layout/media requirements justify them; isolate processing capacity from latency-sensitive API work.
- Use Astro `Image`/`Picture` in its profile with a compatible service; passthrough does not transform images. Consider Unpic's Solid components with a configured image provider or Sharp-backed vite-imagetools for imported static Vite assets. Avoid overlapping pipelines.
- Consider `Bun.Image` in Bun-hosted jobs/builds for supported transforms; Sharp also runs under Bun and covers broader formats/operations. Await async terminals to keep encoding off the JS thread. Verify target codecs: Bun AVIF/HEIC currently lacks Linux support and depends on OS/hardware elsewhere. Bun Image supplies transformation; responsive markup and endpoint/cache integration need their own implementation.
- Select Cloudflare Images for managed transformation/edge caching or imgproxy with a CDN/cache for self-operated delivery. R2 stores objects; it does not transform images. These choices do not require moving the Rust application API into Bun.
- Generate appropriate `srcset`/`sizes` with preserved aspect ratio/stable dimensions; load LCP images promptly and lazy-load off-screen images. Version source/transform cache keys and preserve private-file authorization for originals, variants, and caches.
- Bound source access, input bytes/pixels, variants, and concurrency. Compare equivalent visual quality, delivered bytes, cold/cache-hit latency, throughput, CPU/memory, and cost under the [performance measurement policy](performance.md); vendor results alone do not establish browser performance.

## Official documentation

Use documentation matching the installed version.

- [StyleX compiler](https://stylexjs.com/docs/learn/installation/) and [Solid-compatible attributes](https://stylexjs.com/docs/api/javascript/attrs/)
- [Core Web Vitals](https://web.dev/articles/vitals)
