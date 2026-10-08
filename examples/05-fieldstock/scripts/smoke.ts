import { probeHealth } from "../src/lib/health";

const mode = Bun.argv[2];
if (mode !== "healthy" && mode !== "unavailable")
  throw new Error("Use: bun run smoke healthy|unavailable");
const web = process.env.WEB_ORIGIN ?? "http://127.0.0.1:45105";
const api = process.env.VITE_API_BASE_URL ?? "http://127.0.0.1:45106";
const page = await fetch(web, { signal: AbortSignal.timeout(3000) });
if (!page.ok || !(await page.text()).includes("A clear starting point."))
  throw new Error("Built web shell unavailable");
const result = await probeHealth(api);
if (result.state !== mode) throw new Error(`Expected ${mode}; received ${result.state}`);
if (mode === "healthy") {
  const response = await fetch(`${api}/health`, {
    headers: { origin: web },
    signal: AbortSignal.timeout(3000),
  });
  if (response.headers.get("access-control-allow-origin") !== web)
    throw new Error("Allowed web origin missing");
  if (response.headers.get("cache-control") !== "no-store")
    throw new Error("Health must not be cached");
  const schema = await fetch(`${api}/openapi.json`, { signal: AbortSignal.timeout(3000) }).then(
    (r) => r.json(),
  );
  if (JSON.stringify(schema) !== JSON.stringify(await Bun.file("docs/openapi.json").json()))
    throw new Error("Live contract differs from committed contract");
}
console.log(`Built shell and direct Rust health probe: ${mode}`);
