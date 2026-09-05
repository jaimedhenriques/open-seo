import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import { dirname } from "node:path";
import sharp from "sharp";

const root = ".helix/evidence/brand-assets";
const assets = JSON.parse(
  await readFile(`${root}/candidate-checks.json`, "utf8"),
);
const hash = (data) => createHash("sha256").update(data).digest("hex");
const metadataTypes = new Set(["iCCP", "sRGB", "gAMA", "cHRM", "pHYs"]);
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

// Keep original colour-description chunks verbatim. No colour conversion is
// allowed: raw source channels and the original profile describe the same image.
function chunks(png) {
  assert.ok(png.subarray(0, 8).equals(pngSignature));
  const result = [];
  for (let offset = 8; offset < png.length; ) {
    const length = png.readUInt32BE(offset);
    assert.ok(offset + length + 12 <= png.length);
    result.push({
      type: png.toString("ascii", offset + 4, offset + 8),
      bytes: png.subarray(offset, offset + length + 12),
    });
    offset += length + 12;
  }
  return result;
}
const decode = (input) =>
  sharp(input, { ignoreIcc: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
const pending = [];
const checks = [];
for (const asset of assets) {
  const source = await readFile(asset.source);
  assert.equal(
    hash(source),
    asset.sourceSha256,
    `Original changed: ${asset.name}`,
  );
  const { data: before, info } = await decode(source);
  const { data: candidate, info: candidateInfo } = await decode(
    asset.candidate,
  );
  assert.equal(info.width, candidateInfo.width);
  assert.equal(info.height, candidateInfo.height);
  const after = Buffer.from(before);
  for (const region of asset.regions) {
    assert.ok(
      region.x >= 0 &&
        region.y >= 0 &&
        region.x + region.width <= info.width &&
        region.y + region.height <= info.height,
    );
    for (let y = region.y; y < region.y + region.height; y++) {
      const start = (y * info.width + region.x) * 4;
      candidate.copy(after, start, start, start + region.width * 4);
    }
  }
  const encoded = await sharp(after, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
  const originalMetadata = chunks(source).filter((chunk) =>
    metadataTypes.has(chunk.type),
  );
  const encodedChunks = chunks(encoded).filter(
    (chunk) => !metadataTypes.has(chunk.type),
  );
  const png = Buffer.concat([
    pngSignature,
    encodedChunks[0].bytes,
    ...originalMetadata.map((chunk) => chunk.bytes),
    ...encodedChunks.slice(1).map((chunk) => chunk.bytes),
  ]);
  const { data: verified, info: outputInfo } = await decode(png);
  assert.equal(outputInfo.width, info.width);
  assert.equal(outputInfo.height, info.height);
  assert.ok(
    verified.equals(after),
    `PNG roundtrip changed raw pixels: ${asset.name}`,
  );
  assert.deepEqual(
    chunks(png)
      .filter((chunk) => metadataTypes.has(chunk.type))
      .map((chunk) => hash(chunk.bytes)),
    originalMetadata.map((chunk) => hash(chunk.bytes)),
  );
  let changedPixels = 0;
  let outsideRegionChangedPixels = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const offset = (y * info.width + x) * 4;
      if (
        !before
          .subarray(offset, offset + 4)
          .equals(verified.subarray(offset, offset + 4))
      ) {
        changedPixels++;
        if (
          !asset.regions.some(
            (r) =>
              x >= r.x && x < r.x + r.width && y >= r.y && y < r.y + r.height,
          )
        )
          outsideRegionChangedPixels++;
      }
    }
  }
  assert.ok(changedPixels > 0);
  assert.equal(outsideRegionChangedPixels, 0, asset.name);
  checks.push({
    ...asset,
    outputSha256: hash(png),
    changedPixels,
    outsideRegionChangedPixels,
    originalColourMetadataPreserved: true,
    decoder: "sharp 0.34.5 raw RGBA, ignoreIcc true",
  });
  pending.push({ destination: asset.destination, png });
  console.log(
    `PASS ${asset.name}: ${changedPixels} changed pixels; ZERO outside approved regions; original colour metadata retained`,
  );
}
// Validate the entire batch before replacing any public file.
for (const { destination, png } of pending) {
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(`${destination}.tmp`, png);
  await rename(`${destination}.tmp`, destination);
}
await writeFile(
  `${root}/pixel-checks.json`,
  JSON.stringify(checks, null, 2) + "\n",
);
