const fs = require("fs");
const path = require("path");
const Module = require("module");

const bundledNodeModules = path.join(
  process.env.USERPROFILE || "",
  ".cache",
  "codex-runtimes",
  "codex-primary-runtime",
  "dependencies",
  "node",
  "node_modules"
);
if (fs.existsSync(bundledNodeModules)) {
  const pnpmStore = path.join(bundledNodeModules, ".pnpm");
  const extraPaths = [bundledNodeModules];
  if (fs.existsSync(pnpmStore)) {
    for (const entry of fs.readdirSync(pnpmStore)) {
      const modulesPath = path.join(pnpmStore, entry, "node_modules");
      if (fs.existsSync(modulesPath)) extraPaths.push(modulesPath);
    }
  }
  process.env.NODE_PATH = [process.env.NODE_PATH, ...extraPaths].filter(Boolean).join(path.delimiter);
  Module._initPaths();
}

const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "finish-workbench", "california-house");
const SWATCH_DIR = path.join(OUT, "finish-swatches");
const TABLE_DIR = path.join(OUT, "tables");
const PREVIEW_DIR = path.join(OUT, "previews");
const MASK_DIR = path.join(OUT, "masks");
const RENDER_DIR = path.join(OUT, "sample-renders");
const CLOTH_REMOVED_DIR = path.join(OUT, "cloth-removed");
const CLOTH_REMOVED_PREVIEW_DIR = path.join(OUT, "cloth-removed-previews");

const FINISHES = [
  ["Auburn", "https://californiahouse.com/wp-content/uploads/2023/10/Auburn.jpg"],
  ["Coastal Grey", "https://californiahouse.com/wp-content/uploads/2023/10/Coastal-Grey.jpg"],
  ["Coastal Grey Glazed", "https://californiahouse.com/wp-content/uploads/2023/10/Coastal-Grey-Glazed.jpg"],
  ["Dusk", "https://californiahouse.com/wp-content/uploads/2023/10/Dusk.jpg"],
  ["Frost", "https://californiahouse.com/wp-content/uploads/2023/10/Frost.jpg"],
  ["Honey", "https://californiahouse.com/wp-content/uploads/2023/10/Honey.jpg"],
  ["Java", "https://californiahouse.com/wp-content/uploads/2023/10/Java.jpg"],
  ["Sand", "https://californiahouse.com/wp-content/uploads/2023/10/Sand.jpg"],
  ["Toast", "https://californiahouse.com/wp-content/uploads/2023/10/Toast.jpg"],
  ["Rustic White Oak", "https://californiahouse.com/wp-content/uploads/2023/10/Rustic-White-Oak.jpg"],
  ["Midnight", "https://californiahouse.com/wp-content/uploads/2023/10/Midnight.jpg"],
  ["Truffle", "https://californiahouse.com/wp-content/uploads/2026/03/Truffle.jpg"],
  ["Copper Oak", "https://californiahouse.com/wp-content/uploads/2024/10/Copper-Oak.jpg"],
  ["Graphite Oak", "https://californiahouse.com/wp-content/uploads/2024/10/Graphite-Oak.jpg"],
  ["Honey Distressed Glazed", "https://californiahouse.com/wp-content/uploads/2024/10/Honey-Distressed-Glazed.jpg"],
  ["Auburn Distressed Glazed", "https://californiahouse.com/wp-content/uploads/2024/10/Auburn-Distressed-Glazed.jpg"]
];

function slugify(text) {
  return String(text || "item")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureDirs() {
  for (const dir of [
    OUT,
    SWATCH_DIR,
    TABLE_DIR,
    PREVIEW_DIR,
    MASK_DIR,
    RENDER_DIR,
    CLOTH_REMOVED_DIR,
    CLOTH_REMOVED_PREVIEW_DIR
  ]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function download(url, file) {
  const response = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  const body = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(file, body);
  return body;
}

async function getAverageColor(file) {
  const stats = await sharp(file).resize(32, 32, { fit: "fill" }).stats();
  return stats.channels.slice(0, 3).map((channel) => Math.round(channel.mean));
}

function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return [h, s, max];
}

function isBackground(r, g, b, a) {
  const [, s, v] = rgbToHsv(r, g, b);
  return (
    a < 8 ||
    (r > 244 && g > 244 && b > 244) ||
    (v > 0.86 && s < 0.07) ||
    (r > 232 && g > 232 && b > 232 && Math.abs(r - g) < 8 && Math.abs(r - b) < 8)
  );
}

function isLikelyCloth(r, g, b, x, y, width, height) {
  const [h, s, v] = rgbToHsv(r, g, b);
  const inUpperHalf = y < height * 0.58;
  const notWhite = !(r > 225 && g > 225 && b > 225);
  const blueGreen = h > 145 && h < 250 && s > 0.12 && v < 0.75;
  const greyBlackCloth = s < 0.16 && v < 0.34 && inUpperHalf;
  const tanCloth = h > 30 && h < 58 && s > 0.12 && s < 0.48 && v > 0.32 && v < 0.82 && inUpperHalf;
  const central = x > width * 0.08 && x < width * 0.92;
  return notWhite && central && (blueGreen || greyBlackCloth || tanCloth);
}

function softenMask(mask, width, height, radius = 2) {
  const out = new Uint8Array(mask.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let total = 0;
      let count = 0;
      for (let yy = Math.max(0, y - radius); yy <= Math.min(height - 1, y + radius); yy++) {
        for (let xx = Math.max(0, x - radius); xx <= Math.min(width - 1, x + radius); xx++) {
          total += mask[yy * width + xx];
          count++;
        }
      }
      out[y * width + x] = Math.round(total / count);
    }
  }
  return out;
}

function selectMainClothRegion(mask, width, height) {
  const visited = new Uint8Array(mask.length);
  const components = [];
  const queue = new Int32Array(mask.length);
  const targetX = width * 0.52;
  const targetY = height * 0.37;

  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || visited[start]) continue;
    let head = 0;
    let tail = 0;
    let area = 0;
    let sumX = 0;
    let sumY = 0;
    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0;
    queue[tail++] = start;
    visited[start] = 1;

    while (head < tail) {
      const p = queue[head++];
      const x = p % width;
      const y = Math.floor(p / width);
      area++;
      sumX += x;
      sumY += y;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;

      const neighbors = [p - 1, p + 1, p - width, p + width];
      for (const n of neighbors) {
        if (n < 0 || n >= mask.length || visited[n] || !mask[n]) continue;
        const nx = n % width;
        if ((n === p - 1 && nx !== x - 1) || (n === p + 1 && nx !== x + 1)) continue;
        visited[n] = 1;
        queue[tail++] = n;
      }
    }

    if (area < 1200) continue;
    const cx = sumX / area;
    const cy = sumY / area;
    const distancePenalty = Math.hypot((cx - targetX) / width, (cy - targetY) / height) * width * 0.45;
    const upperBonus = cy < height * 0.55 ? area * 0.25 : -area * 0.5;
    components.push({ area, minX, minY, maxX, maxY, score: area + upperBonus - distancePenalty });
  }

  components.sort((a, b) => b.score - a.score);
  const keep = components.slice(0, 2).filter((component, index) => index === 0 || component.area > components[0].area * 0.24);
  const out = new Uint8Array(mask.length);
  for (const component of keep) {
    for (let y = component.minY; y <= component.maxY; y++) {
      for (let x = component.minX; x <= component.maxX; x++) {
        const p = y * width + x;
        if (mask[p]) out[p] = 255;
      }
    }
  }
  return out;
}

function dilate(mask, width, height, radius = 2) {
  const out = new Uint8Array(mask.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let on = false;
      for (let yy = Math.max(0, y - radius); yy <= Math.min(height - 1, y + radius) && !on; yy++) {
        for (let xx = Math.max(0, x - radius); xx <= Math.min(width - 1, x + radius); xx++) {
          if (mask[yy * width + xx]) {
            on = true;
            break;
          }
        }
      }
      out[y * width + x] = on ? 255 : 0;
    }
  }
  return out;
}

function erode(mask, width, height, radius = 2) {
  const out = new Uint8Array(mask.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let on = true;
      for (let yy = Math.max(0, y - radius); yy <= Math.min(height - 1, y + radius) && on; yy++) {
        for (let xx = Math.max(0, x - radius); xx <= Math.min(width - 1, x + radius); xx++) {
          if (!mask[yy * width + xx]) {
            on = false;
            break;
          }
        }
      }
      out[y * width + x] = on ? 255 : 0;
    }
  }
  return out;
}

function fillMaskHoles(mask, width, height) {
  const reachable = new Uint8Array(mask.length);
  const queue = new Int32Array(mask.length);
  let head = 0;
  let tail = 0;
  function push(p) {
    if (p < 0 || p >= mask.length || mask[p] || reachable[p]) return;
    reachable[p] = 1;
    queue[tail++] = p;
  }
  for (let x = 0; x < width; x++) {
    push(x);
    push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    push(y * width);
    push(y * width + width - 1);
  }
  while (head < tail) {
    const p = queue[head++];
    const x = p % width;
    const neighbors = [p - width, p + width];
    if (x > 0) neighbors.push(p - 1);
    if (x < width - 1) neighbors.push(p + 1);
    for (const n of neighbors) push(n);
  }
  const out = new Uint8Array(mask.length);
  for (let p = 0; p < mask.length; p++) {
    out[p] = mask[p] || !reachable[p] ? 255 : 0;
  }
  return out;
}

async function makeMasks(tableFile, slug) {
  const image = sharp(tableFile).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const foreground = new Uint8Array(width * height);
  const cloth = new Uint8Array(width * height);
  const wood = new Uint8Array(width * height);

  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    const x = p % width;
    const y = Math.floor(p / width);
    const fg = !isBackground(r, g, b, a);
    foreground[p] = fg ? 255 : 0;
    if (fg && isLikelyCloth(r, g, b, x, y, width, height)) cloth[p] = 255;
  }

  const mainCloth = selectMainClothRegion(cloth, width, height);
  const closedCloth = erode(dilate(mainCloth, width, height, 5), width, height, 4);
  const filledCloth = fillMaskHoles(closedCloth, width, height);
  const softCloth = softenMask(filledCloth, width, height, 2);
  for (let p = 0; p < foreground.length; p++) {
    const isWood = foreground[p] > 0 && softCloth[p] < 80;
    wood[p] = isWood ? 255 : 0;
  }
  const softWood = softenMask(wood, width, height, 1);

  const foregroundPath = path.join(MASK_DIR, `${slug}-foreground-mask.png`);
  const clothPath = path.join(MASK_DIR, `${slug}-cloth-mask.png`);
  const woodPath = path.join(MASK_DIR, `${slug}-wood-mask.png`);

  await sharp(Buffer.from(foreground), { raw: { width, height, channels: 1 } }).png().toFile(foregroundPath);
  await sharp(Buffer.from(softCloth), { raw: { width, height, channels: 1 } }).png().toFile(clothPath);
  await sharp(Buffer.from(softWood), { raw: { width, height, channels: 1 } }).png().toFile(woodPath);

  const overlay = Buffer.from(data);
  for (let i = 0, p = 0; i < overlay.length; i += 4, p++) {
    if (softCloth[p] > 80) {
      overlay[i] = Math.round(overlay[i] * 0.35);
      overlay[i + 1] = Math.round(overlay[i + 1] * 0.45 + 255 * 0.55);
      overlay[i + 2] = Math.round(overlay[i + 2] * 0.35);
    } else if (softWood[p] > 80) {
      overlay[i] = Math.round(overlay[i] * 0.45 + 255 * 0.45);
      overlay[i + 1] = Math.round(overlay[i + 1] * 0.45 + 170 * 0.35);
      overlay[i + 2] = Math.round(overlay[i + 2] * 0.45);
    }
  }
  const previewPath = path.join(PREVIEW_DIR, `${slug}-mask-preview.png`);
  await sharp(overlay, { raw: { width, height, channels: 4 } }).png().toFile(previewPath);

  const clothRemovedPath = path.join(CLOTH_REMOVED_DIR, `${slug}-cloth-removed.png`);
  const cutout = Buffer.from(data);
  for (let i = 0, p = 0; i < cutout.length; i += 4, p++) {
    if (softCloth[p] > 20) {
      cutout[i + 3] = Math.max(0, Math.round(255 - softCloth[p]));
    }
  }
  await sharp(cutout, { raw: { width, height, channels: 4 } }).png().toFile(clothRemovedPath);

  const checkerPath = path.join(CLOTH_REMOVED_PREVIEW_DIR, `${slug}-checker-preview.png`);
  const checker = Buffer.alloc(width * height * 4);
  const square = 48;
  for (let i = 0, p = 0; p < width * height; i += 4, p++) {
    const x = p % width;
    const y = Math.floor(p / width);
    const isLight = (Math.floor(x / square) + Math.floor(y / square)) % 2 === 0;
    const tone = isLight ? 238 : 198;
    checker[i] = tone;
    checker[i + 1] = isLight ? 242 : 207;
    checker[i + 2] = isLight ? 244 : 212;
    checker[i + 3] = 255;
  }
  await sharp(checker, { raw: { width, height, channels: 4 } })
    .composite([{ input: cutout, raw: { width, height, channels: 4 } }])
    .png()
    .toFile(checkerPath);

  return { width, height, foregroundPath, clothPath, woodPath, previewPath, clothRemovedPath, checkerPath };
}

async function renderSample(tableFile, slug, finish, finishFile, avgColor, woodMaskPath) {
  const base = sharp(tableFile).ensureAlpha();
  const { data, info } = await base.raw().toBuffer({ resolveWithObject: true });
  const { data: mask, info: maskInfo } = await sharp(woodMaskPath)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (maskInfo.width !== info.width || maskInfo.height !== info.height) {
    throw new Error(`Mask size mismatch for ${slug}`);
  }
  const [fr, fg, fb] = avgColor;
  const out = Buffer.from(data);
  for (let i = 0, p = 0; i < out.length; i += 4, p++) {
    const m = Math.pow(mask[p] / 255, 0.58);
    if (m <= 0.03) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const localContrast = Math.max(-0.18, Math.min(0.22, (r - g + r - b) / 510));
    const shade = Math.max(0.22, Math.min(1.55, 0.36 + luminance * 1.18 + localContrast * 0.18));
    const targetR = Math.max(0, Math.min(255, fr * shade));
    const targetG = Math.max(0, Math.min(255, fg * shade));
    const targetB = Math.max(0, Math.min(255, fb * shade));
    const strength = Math.min(0.96, m * 1.18);
    out[i] = Math.round(r * (1 - strength) + targetR * strength);
    out[i + 1] = Math.round(g * (1 - strength) + targetG * strength);
    out[i + 2] = Math.round(b * (1 - strength) + targetB * strength);
  }
  const outDir = path.join(RENDER_DIR, slug);
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${slug}__${slugify(finish)}.png`);
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(outFile);
  return outFile;
}

async function main() {
  ensureDirs();
  const products = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "products.json"), "utf8"))
    .filter((product) => product.vendor.startsWith("California House"))
    .sort((a, b) => a.title.localeCompare(b.title));

  const finishRecords = [];
  for (const [name, url] of FINISHES) {
    const slug = slugify(name);
    const file = path.join(SWATCH_DIR, `${slug}.jpg`);
    if (!fs.existsSync(file)) await download(url, file);
    const averageColor = await getAverageColor(file);
    finishRecords.push({ name, slug, url, file: path.relative(OUT, file).replace(/\\/g, "/"), averageColor });
  }

  const tableRecords = [];
  for (const product of products) {
    const title = product.title.replace(/\s*\|\s*California House\s*$/, "");
    const slug = slugify(title);
    const src = path.join(ROOT, product.image.normalized.replace(/^\//, "").replace(/\//g, path.sep));
    const tableFile = path.join(TABLE_DIR, `${slug}.png`);
    fs.copyFileSync(src, tableFile);
    const masks = await makeMasks(tableFile, slug);
    const sampleFinishes = finishRecords.filter((finish) => ["honey", "java", "coastal-grey-glazed", "midnight"].includes(finish.slug));
    const sampleRenders = [];
    for (const finish of sampleFinishes) {
      sampleRenders.push({
        finish: finish.name,
        file: path.relative(OUT, await renderSample(tableFile, slug, finish.name, path.join(OUT, finish.file), finish.averageColor, masks.woodPath)).replace(/\\/g, "/")
      });
    }
    tableRecords.push({
      title,
      slug,
      sourceUrl: product.sourceUrl,
      tableFile: path.relative(OUT, tableFile).replace(/\\/g, "/"),
      masks: {
        foreground: path.relative(OUT, masks.foregroundPath).replace(/\\/g, "/"),
        cloth: path.relative(OUT, masks.clothPath).replace(/\\/g, "/"),
        wood: path.relative(OUT, masks.woodPath).replace(/\\/g, "/"),
        preview: path.relative(OUT, masks.previewPath).replace(/\\/g, "/")
      },
      clothRemovedFile: path.relative(OUT, masks.clothRemovedPath).replace(/\\/g, "/"),
      clothRemovedPreviewFile: path.relative(OUT, masks.checkerPath).replace(/\\/g, "/"),
      sampleRenders
    });
  }

  fs.writeFileSync(path.join(OUT, "finish-library.json"), JSON.stringify(finishRecords, null, 2));
  fs.writeFileSync(path.join(OUT, "table-workbench.json"), JSON.stringify(tableRecords, null, 2));
  console.log(`Prepared ${products.length} California House tables and ${finishRecords.length} finishes in ${OUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
