import { mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");

async function run(command: string[]) {
  const child = Bun.spawn(command, { cwd: root, stdout: "pipe", stderr: "inherit" });
  const output = await new Response(child.stdout).text();
  if ((await child.exited) !== 0) throw new Error(`Failed: ${command.join(" ")}`);
  return output;
}

await mkdir(join(root, ".local"), { recursive: true });
const temp = await mkdtemp(join(root, ".local", "contract-"));
try {
  const specification = join(temp, "openapi.json");
  const declarations = join(temp, "api-schema.d.ts");
  const exported = await run([
    "sh",
    "scripts/cargo.sh",
    "run",
    "--locked",
    "--",
    "--export-openapi",
  ]);
  JSON.parse(exported);
  await writeFile(specification, exported);
  await run(["bun", "--bun", "openapi-typescript", specification, "-o", declarations]);
  await run(["bun", "--bun", "oxfmt", "--threads", "2", declarations]);
  // Publish only after export, parsing, type generation and formatting all succeed.
  await rename(declarations, join(root, "src/lib/api-schema.d.ts"));
  await rename(specification, join(root, "docs/openapi.json"));
  console.log("Generated Rust → OpenAPI → TypeScript contract; review both artifacts.");
} finally {
  await rm(temp, { recursive: true, force: true });
}
