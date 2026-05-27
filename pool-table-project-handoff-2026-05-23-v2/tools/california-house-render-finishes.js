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
const WORKBENCH = path.join(ROOT, "finish-workbench", "california-house");
const RENDER_DIR = path.join(WORKBENCH, "finish-renders");
const EXPORT_DIR = path.join(ROOT, "exports", "california-house-finish-renders");
const TABLES_FILE = path.join(WORKBENCH, "table-workbench.json");
const FINISHES_FILE = path.join(WORKBENCH, "finish-library.json");
const MANIFEST_FILE = path.join(WORKBENCH, "finish-render-manifest.json");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function relativeToWorkbench(file) {
  return path.relative(WORKBENCH, file).replace(/\\/g, "/");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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

function isBackgroundOrShadow(r, g, b, a) {
  if (a < 20) return false;
  const [, s, v] = rgbToHsv(r, g, b);
  const whiteBackground = v > 0.86 && s < 0.14;
  const softNeutralShadow = v > 0.42 && s < 0.09;
  const paleWarmShadow = v > 0.58 && s < 0.16 && r >= g && g >= b;
  return whiteBackground || softNeutralShadow || paleWarmShadow;
}

function shouldKeepOriginal(r, g, b) {
  const [, s, v] = rgbToHsv(r, g, b);
  const veryDarkRubber = v < 0.11 && s < 0.22;
  const brightSmallObject = v > 0.8 && s > 0.18;
  return veryDarkRubber || brightSmallObject;
}

async function loadGreyMask(file, width, height) {
  if (!file || !fs.existsSync(file)) return null;
  const { data, info } = await sharp(file).resize(width, height, { fit: "fill" }).greyscale().raw().toBuffer({
    resolveWithObject: true
  });
  if (info.width !== width || info.height !== height) return null;
  return data;
}

async function loadFinishTexture(file) {
  const { data, info } = await sharp(file).rotate().resize(384, 384, { fit: "cover" }).ensureAlpha().raw().toBuffer({
    resolveWithObject: true
  });
  let r = 0;
  let g = 0;
  let b = 0;
  const pixels = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  return {
    data,
    width: info.width,
    height: info.height,
    average: [r / pixels, g / pixels, b / pixels]
  };
}

function sampleTexture(texture, x, y, width, height) {
  const tx = Math.abs(Math.floor((x * 0.72 + y * 0.18) % texture.width));
  const ty = Math.abs(Math.floor((y * 0.34 + x * 0.05) % texture.height));
  const i = (ty * texture.width + tx) * 4;
  const grain = 0.72 + ((texture.data[i] + texture.data[i + 1] + texture.data[i + 2]) / 765) * 0.56;
  return [
    clamp(texture.average[0] * grain, 0, 255),
    clamp(texture.average[1] * grain, 0, 255),
    clamp(texture.average[2] * grain, 0, 255)
  ];
}

async function renderTableFinish(table, finish) {
  const baseFile = path.join(WORKBENCH, table.clothRemovedFile);
  const maskFile = table.masks?.wood ? path.join(WORKBENCH, table.masks.wood) : "";
  const finishFile = path.join(WORKBENCH, finish.file);
  const base = sharp(baseFile).ensureAlpha();
  const { data, info } = await base.raw().toBuffer({ resolveWithObject: true });
  const mask = await loadGreyMask(maskFile, info.width, info.height);
  const texture = await loadFinishTexture(finishFile);
  const out = Buffer.from(data);

  for (let i = 0, p = 0; i < out.length; i += 4, p++) {
    const a = data[i + 3];
    if (a < 20) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (isBackgroundOrShadow(r, g, b, a) || shouldKeepOriginal(r, g, b)) continue;

    const x = p % info.width;
    const y = Math.floor(p / info.width);
    const autoMask = mask ? mask[p] / 255 : 1;
    if (autoMask < 0.08) continue;

    const [tr, tg, tb] = sampleTexture(texture, x, y, info.width, info.height);
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const shade = clamp(0.32 + lum * 1.2, 0.2, 1.42);
    const detail = clamp((r - g + r - b) / 680, -0.08, 0.1);
    const targetR = clamp(tr * (shade + detail), 0, 255);
    const targetG = clamp(tg * (shade - detail * 0.25), 0, 255);
    const targetB = clamp(tb * (shade - detail * 0.35), 0, 255);
    const strength = clamp(0.84 * Math.pow(autoMask, 0.55), 0, 0.92);
    out[i] = Math.round(r * (1 - strength) + targetR * strength);
    out[i + 1] = Math.round(g * (1 - strength) + targetG * strength);
    out[i + 2] = Math.round(b * (1 - strength) + targetB * strength);
  }

  const renderFolder = path.join(RENDER_DIR, finish.slug);
  const exportFolder = path.join(EXPORT_DIR, finish.slug);
  ensureDir(renderFolder);
  ensureDir(exportFolder);
  const fileName = `${table.slug}__${finish.slug}.png`;
  const renderFile = path.join(renderFolder, fileName);
  const exportFile = path.join(exportFolder, fileName);
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(renderFile);
  fs.copyFileSync(renderFile, exportFile);
  return relativeToWorkbench(renderFile);
}

async function main() {
  ensureDir(RENDER_DIR);
  ensureDir(EXPORT_DIR);
  const tables = JSON.parse(fs.readFileSync(TABLES_FILE, "utf8"));
  const finishes = JSON.parse(fs.readFileSync(FINISHES_FILE, "utf8"));
  const manifest = {
    createdAt: new Date().toISOString(),
    tableCount: tables.length,
    finishCount: finishes.length,
    root: "finish-renders",
    finishes: []
  };

  for (const finish of finishes) {
    const records = [];
    for (const table of tables) {
      records.push({
        title: table.title,
        slug: table.slug,
        file: await renderTableFinish(table, finish)
      });
    }
    manifest.finishes.push({
      name: finish.name,
      slug: finish.slug,
      swatchFile: finish.file,
      tables: records
    });
  }

  fs.writeFileSync(MANIFEST_FILE, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Rendered ${tables.length * finishes.length} finish images in ${RENDER_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
