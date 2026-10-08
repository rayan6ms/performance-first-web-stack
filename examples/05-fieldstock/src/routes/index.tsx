import { createSignal, onCleanup, onMount } from "solid-js";
import { apiBaseUrl, probeHealth } from "../lib/health";

export default function Home() {
  const [state, setState] = createSignal<"checking" | "healthy" | "unavailable">("checking");
  let request: AbortController | undefined;
  async function checkHealth() {
    request?.abort();
    const current = new AbortController();
    request = current;
    setState("checking");
    const result = await probeHealth(apiBaseUrl, current.signal);
    if (!current.signal.aborted) setState(result.state);
  }
  onMount(() => {
    void checkHealth();
  });
  onCleanup(() => {
    request?.abort();
  });

  return (
    <main>
      <header>
        <span class="brand">FieldStock</span>
        <span class="stage">Initial foundation</span>
      </header>
      <section aria-labelledby="heading">
        <p class="eyebrow">WAREHOUSE OPERATIONS</p>
        <h1 id="heading">A clear starting point.</h1>
        <p class="intro">
          The workspace is taking shape. Inventory workflows will follow once data ownership and
          access are settled.
        </p>
        <div class="health-panel">
          <h2>Service connection</h2>
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            class="status"
            data-state={state()}
          >
            <span class="dot" aria-hidden="true" />
            <span>
              {state() === "healthy"
                ? "Rust service healthy"
                : state() === "unavailable"
                  ? "Rust service unavailable"
                  : "Checking Rust service…"}
            </span>
          </div>
          <p>
            {state() === "healthy"
              ? "The service answered the health check. Stock data and authorized actions are not available yet."
              : state() === "unavailable"
                ? "The service could not be reached or returned an invalid response. Start the local API, then try again."
                : "Waiting for a verified response from the local service."}
          </p>
          <button
            type="button"
            onClick={() => {
              void checkHealth();
            }}
            disabled={state() === "checking"}
          >
            Check again
          </button>
          <noscript>
            <p>Enable JavaScript to check the service connection.</p>
          </noscript>
        </div>
      </section>
      <footer>Foundation only · No inventory records or stock actions</footer>
    </main>
  );
}
