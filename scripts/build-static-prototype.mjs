import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(rootDir, "dist-static");

const prototypeFiles = [
  "index.html",
  "contact-us.html",
  "pool-tables.html",
  "austin-pool-table.html",
  "cues.html",
  "bull-carbon-black-with-6-purple-abalone-points.html",
  "ping-pong-tables.html",
  "whistler-indoor-table-tennis-table.html",
  "traeger-smokers.html",
  "dartboards.html"
];

const assetDirectories = ["assets", "scraped-products"];

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

for (const file of prototypeFiles) {
  await cp(path.join(rootDir, file), path.join(outputDir, file));
}

for (const directory of assetDirectories) {
  await cp(path.join(rootDir, directory), path.join(outputDir, directory), {
    recursive: true
  });
}

await writeFile(
  path.join(outputDir, "STATIC_PROTOTYPE_PREVIEW.txt"),
  [
    "Home Billiards static prototype preview.",
    "Generated from preserved root HTML files for staff review.",
    "This is not the Next.js foundation and does not connect to BigCommerce.",
    ""
  ].join("\n")
);

console.log(`Static prototype copied to ${path.relative(rootDir, outputDir)}`);
