import { afterEach, expect, test } from "bun:test";
import { probeHealth } from "./health";

// Isolated malformed-wire tests; no test server is presented as real API readiness.
let server: ReturnType<typeof Bun.serve> | undefined;
afterEach(() => {
  server?.stop(true);
  server = undefined;
});

test("rejects non-contract wire data and non-success HTTP responses", async () => {
  let reply = Response.json({ status: "ok", privateData: "must not be accepted" });
  server = Bun.serve({ hostname: "127.0.0.1", port: 0, fetch: () => reply });
  expect(await probeHealth(server.url.href)).toEqual({ state: "unavailable" });
  reply = Response.json({ status: "degraded" });
  expect(await probeHealth(server.url.href)).toEqual({ state: "unavailable" });
  reply = new Response("invalid json", { headers: { "content-type": "application/json" } });
  expect(await probeHealth(server.url.href)).toEqual({ state: "unavailable" });
  reply = Response.json({ status: "ok" }, { status: 503 });
  expect(await probeHealth(server.url.href)).toEqual({ state: "unavailable" });
});

test("aborted requests are unavailable", async () => {
  const controller = new AbortController();
  controller.abort();
  expect(await probeHealth("http://127.0.0.1:45106", controller.signal)).toEqual({
    state: "unavailable",
  });
});
