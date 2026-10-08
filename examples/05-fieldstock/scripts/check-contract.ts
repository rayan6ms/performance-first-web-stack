import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

async function run(command: string[]) {
  const child = Bun.spawn(command, { stdout: "pipe", stderr: "inherit" });
  const output = await new Response(child.stdout).text();
  if ((await child.exited) !== 0) throw new Error(`Failed: ${command.join(" ")}`);
  return output;
}

const exported = await run(["sh", "scripts/cargo.sh", "run", "--locked", "--", "--export-openapi"]);
const committed = await Bun.file("docs/openapi.json").json();
if (JSON.stringify(JSON.parse(exported)) !== JSON.stringify(committed))
  throw new Error("Rust OpenAPI drift: run bun run contract:generate and review");
const temp = await mkdtemp(join(tmpdir(), "fieldstock-contract-"));
try {
  const output = join(temp, "api-schema.d.ts");
  await run(["bun", "--bun", "openapi-typescript", "docs/openapi.json", "-o", output]);
  await run(["bun", "--bun", "oxfmt", "--threads", "2", output]);
  if ((await Bun.file(output).text()) !== (await Bun.file("src/lib/api-schema.d.ts").text()))
    throw new Error("Generated TypeScript drift: run bun run contract:generate and review");
  console.log("Rust → OpenAPI → generated TypeScript contract is current");
} finally {
  await rm(temp, { recursive: true, force: true });
}
