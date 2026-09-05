import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { dirname } from "node:path";

const sources = JSON.parse(
  await readFile(new URL("./screenshot-sources.json", import.meta.url), "utf8"),
);
const hash = (data) => createHash("sha256").update(data).digest("hex");
for (const source of sources) {
  let data;
  try {
    await access(source.path);
    data = await readFile(source.path);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    if (source.gitRef) {
      data = execFileSync(
        "git",
        ["show", `${source.gitRef}:${source.gitPath}`],
        { maxBuffer: 10 * 1024 * 1024 },
      );
    } else {
      const response = await fetch(source.url, {
        signal: AbortSignal.timeout(30000),
      });
      assert.ok(
        response.ok,
        `Download failed (${response.status}): ${source.name}`,
      );
      data = Buffer.from(await response.arrayBuffer());
    }
  }
  assert.equal(
    hash(data),
    source.sha256,
    `Source differs from reviewed original: ${source.name}`,
  );
  await mkdir(dirname(source.path), { recursive: true });
  await writeFile(source.path, data);
  console.log(`VERIFIED original ${source.name}`);
}
