import createClient from "openapi-fetch";
import * as v from "valibot";
import type { components, paths } from "./api-schema";

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:45106";
const healthSchema = v.strictObject({ status: v.literal("ok") });
export type Health = components["schemas"]["HealthResponse"];
export type HealthResult = { state: "healthy"; health: Health } | { state: "unavailable" };

// No browser credentials or Bun forwarding layer. Generated types are not runtime validation.
export async function probeHealth(
  baseUrl = apiBaseUrl,
  signal?: AbortSignal,
): Promise<HealthResult> {
  try {
    const client = createClient<paths>({ baseUrl });
    const { data, response } = await client.GET("/health", {
      cache: "no-store",
      credentials: "omit",
      signal: signal
        ? AbortSignal.any([signal, AbortSignal.timeout(3000)])
        : AbortSignal.timeout(3000),
    });
    if (!response.ok) return { state: "unavailable" };
    const parsed = v.safeParse(healthSchema, data);
    return parsed.success ? { state: "healthy", health: parsed.output } : { state: "unavailable" };
  } catch {
    return { state: "unavailable" };
  }
}
