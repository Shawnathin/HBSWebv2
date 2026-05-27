const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const crypto = require("crypto");
const Module = require("module");

const bundledNodeModules = path.join(
  process.env.USERPROFILE || process.env.HOME || "",
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

let chromium;
let sharp;
try {
  ({ chromium } = require("playwright"));
  sharp = require("sharp");
} catch (error) {
  console.error("Missing bundled dependencies. Start this app with .\\start.ps1");
  console.error(error.message);
  process.exit(1);
}

const PORT = Number(process.env.PORT || 4174);
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_DIR = path.join(ROOT, "data");
const ASSETS_DIR = path.join(DATA_DIR, "assets");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const RUNS_FILE = path.join(DATA_DIR, "runs.json");
const CALIFORNIA_WORKBENCH_DIR = path.join(ROOT, "finish-workbench", "california-house");
const CALIFORNIA_WORKBENCH_FILE = path.join(CALIFORNIA_WORKBENCH_DIR, "table-workbench.json");
const MANUAL_CUTOUT_DIR = path.join(CALIFORNIA_WORKBENCH_DIR, "manual-cutouts");
const CLOTH_REMOVED_DIR = path.join(CALIFORNIA_WORKBENCH_DIR, "cloth-removed");
const CLOTH_REMOVED_PREVIEW_DIR = path.join(CALIFORNIA_WORKBENCH_DIR, "cloth-removed-previews");
const CLOTH_MASK_DIR = path.join(CALIFORNIA_WORKBENCH_DIR, "masks");
const CLOTH_EXPORT_DIR = path.join(ROOT, "exports", "california-house-cloth-removed");
const AI_RENDER_DIR = path.join(CALIFORNIA_WORKBENCH_DIR, "ai-renders");
const AI_RENDER_EXPORT_DIR = path.join(ROOT, "exports", "california-house-ai-renders");
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36";

fs.mkdirSync(ASSETS_DIR, { recursive: true });
for (const dir of [
  MANUAL_CUTOUT_DIR,
  CLOTH_REMOVED_DIR,
  CLOTH_REMOVED_PREVIEW_DIR,
  CLOTH_MASK_DIR,
  CLOTH_EXPORT_DIR,
  AI_RENDER_DIR,
  AI_RENDER_EXPORT_DIR
]) {
  fs.mkdirSync(dir, { recursive: true });
}
if (!fs.existsSync(PRODUCTS_FILE)) fs.writeFileSync(PRODUCTS_FILE, "[]\n");
if (!fs.existsSync(RUNS_FILE)) fs.writeFileSync(RUNS_FILE, "[]\n");

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function slugify(text) {
  const clean = String(text || "product")
    .toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return clean || crypto.randomBytes(4).toString("hex");
}

function makeId(value) {
  return crypto.createHash("sha1").update(value).digest("hex").slice(0, 12);
}

function sameSite(baseUrl, candidate) {
  try {
    const base = new URL(baseUrl);
    const next = new URL(candidate, baseUrl);
    return base.hostname === next.hostname;
  } catch {
    return false;
  }
}

function scoreProductLink(url, text) {
  const haystack = `${url} ${text || ""}`.toLowerCase();
  let score = 0;
  const positive = [
    "pool-table",
    "pool_table",
    "billiard",
    "table",
    "/products/",
    "/product/",
    "/collections/",
    "/shop/",
    "/catalog/"
  ];
  const negative = [
    "product-category",
    "/category/",
    "cart",
    "checkout",
    "account",
    "login",
    "privacy",
    "terms",
    "contact",
    "blog",
    "news",
    "lookbook",
    "wishlist",
    "finish",
    "cloth"
  ];
  for (const word of positive) if (haystack.includes(word)) score += 2;
  for (const word of negative) if (haystack.includes(word)) score -= 4;
  if (/\/products?\/[^/?#]+/i.test(url)) score += 8;
  if (/\/collections?\/[^/?#]+\/products?\//i.test(url)) score += 8;
  if (/\.(jpg|jpeg|png|webp|gif|pdf)$/i.test(url)) score -= 10;
  return score;
}

function isLikelyPoolProductPage(url, text = "") {
  try {
    const parsed = new URL(url);
    const haystack = `${parsed.pathname} ${text}`.toLowerCase();
    if (/product-category|\/category\/|lookbook|shuffleboard|pub-table|game-table|cue-rack|play-package/.test(haystack)) {
      return false;
    }
    const hasProductShape = /\/products?\//.test(parsed.pathname) || (parsed.pathname === "/shop" && parsed.searchParams.has("productId"));
    if (!hasProductShape) return false;
    return /pool[-_\s]?table|billiard/.test(haystack);
  } catch {
    return false;
  }
}

function isLikelyProductCardUrl(url) {
  try {
    const parsed = new URL(url);
    return /\/products?\//.test(parsed.pathname) || (parsed.pathname === "/shop" && parsed.searchParams.has("productId"));
  } catch {
    return false;
  }
}

function productTitleFromImage(image) {
  const raw = decodeURIComponent(
    image.alt ||
      path.basename(new URL(image.src).pathname).replace(/\.[a-z0-9]+$/i, "") ||
      "Product"
  );
  return raw
    .replace(/[_-]?XLthumbnail/gi, "")
    .replace(/thumbnailXL/gi, "")
    .replace(/thumbnail/gi, "")
    .replace(/pooltable/gi, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function imageExtension(contentType, url) {
  if (contentType && contentType.includes("png")) return ".png";
  if (contentType && contentType.includes("webp")) return ".webp";
  if (contentType && contentType.includes("jpeg")) return ".jpg";
  const fromUrl = path.extname(new URL(url).pathname).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp"].includes(fromUrl) ? fromUrl : ".jpg";
}

function assetPathToUrl(filePath) {
  return `/${path.relative(ROOT, filePath).replace(/\\/g, "/")}`;
}

async function getBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function collectCandidateLinks(page, startUrl, maxPages) {
  if (!page) return collectCandidateLinksFromHtml(startUrl, maxPages);

  await page.goto(startUrl, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(800);

  const rawLinks = await page.$$eval("a[href]", (anchors) =>
    anchors.map((anchor) => ({
      href: anchor.href,
      text: anchor.textContent || "",
      title: anchor.getAttribute("title") || ""
    }))
  );

  const links = new Map();
  for (const link of rawLinks) {
    if (!sameSite(startUrl, link.href)) continue;
    const clean = new URL(link.href);
    clean.hash = "";
    const href = clean.toString();
    const score = scoreProductLink(href, `${link.text} ${link.title}`);
    if (score < 2) continue;
    const existing = links.get(href);
    if (!existing || score > existing.score) {
      links.set(href, { url: href, score, label: (link.text || link.title || "").trim() });
    }
  }

  const startScore = scoreProductLink(startUrl, "");
  if (startScore >= 2) links.set(startUrl, { url: startUrl, score: startScore, label: "Start page" });

  return [...links.values()]
    .sort((a, b) => b.score - a.score || a.url.localeCompare(b.url))
    .slice(0, maxPages);
}

async function extractPageProduct(page, productUrl) {
  if (!page) return extractPageProductFromHtml(productUrl);

  await page.goto(productUrl, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(900);

  const data = await page.evaluate(() => {
    const text = (selector) => document.querySelector(selector)?.textContent?.trim() || "";
    const meta = (name) =>
      document.querySelector(`meta[property="${name}"]`)?.content ||
      document.querySelector(`meta[name="${name}"]`)?.content ||
      "";
    const title =
      meta("og:title") ||
      text("h1") ||
      document.title.replace(/\s*[|-].*$/, "").trim() ||
      "Untitled product";

    const images = [];
    for (const img of document.images) {
      const rect = img.getBoundingClientRect();
      const src =
        img.currentSrc ||
        img.src ||
        img.getAttribute("data-src") ||
        img.getAttribute("data-zoom") ||
        img.getAttribute("data-original");
      if (!src) continue;
      images.push({
        src,
        alt: img.alt || "",
        width: img.naturalWidth || Math.round(rect.width),
        height: img.naturalHeight || Math.round(rect.height),
        visibleWidth: Math.round(rect.width),
        visibleHeight: Math.round(rect.height),
        className: img.className || "",
        id: img.id || ""
      });
    }

    return {
      title,
      sku: text("[itemprop='sku'], .sku, .product-sku, [data-sku]"),
      canonical: document.querySelector("link[rel='canonical']")?.href || location.href,
      ogImage: meta("og:image"),
      images
    };
  });

  const images = data.images
    .map((image) => {
      const haystack = `${image.src} ${image.alt} ${image.className} ${image.id}`.toLowerCase();
      let score = image.width * image.height;
      if (haystack.includes("pool")) score += 900000;
      if (haystack.includes("billiard")) score += 900000;
      if (haystack.includes("table")) score += 500000;
      if (haystack.includes("product")) score += 350000;
      if (haystack.includes("thumb")) score -= 600000;
      if (haystack.includes("logo")) score -= 1200000;
      if (image.width < 500 || image.height < 300) score -= 1000000;
      return { ...image, score };
    })
    .filter((image) => image.src && image.score > 0)
    .sort((a, b) => b.score - a.score);

  if (data.ogImage && !images.some((image) => image.src === data.ogImage)) {
    images.unshift({
      src: data.ogImage,
      alt: "Open Graph product image",
      width: 0,
      height: 0,
      visibleWidth: 0,
      visibleHeight: 0,
      className: "",
      id: "",
      score: 800000
    });
  }

  return { ...data, url: productUrl, images };
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { "user-agent": USER_AGENT } });
  if (!response.ok) throw new Error(`Page request failed: ${response.status}`);
  return response.text();
}

function decodeHtml(text) {
  return String(text || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripTags(text) {
  return decodeHtml(String(text || "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function attrsFromTag(tag) {
  const attrs = {};
  const regex = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let match;
  while ((match = regex.exec(tag))) attrs[match[1].toLowerCase()] = decodeHtml(match[2] || match[3] || match[4] || "");
  return attrs;
}

function bestFromSrcset(srcset) {
  if (!srcset) return "";
  const candidates = srcset
    .split(",")
    .map((part) => {
      const [src, size] = part.trim().split(/\s+/);
      const score = Number(String(size || "").replace(/[^\d.]/g, "")) || 0;
      return { src, score };
    })
    .filter((item) => item.src)
    .sort((a, b) => b.score - a.score);
  return candidates[0]?.src || "";
}

function normalizeImageUrl(src, baseUrl) {
  const absolute = new URL(src, baseUrl);
  if (absolute.pathname === "/_next/image" && absolute.searchParams.get("url")) {
    return new URL(absolute.searchParams.get("url"), baseUrl).toString();
  }
  return absolute.toString();
}

function extractImagesFromHtml(html, baseUrl) {
  const images = [];
  const imgRegex = /<img\b[^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(html))) {
    const attrs = attrsFromTag(match[0]);
    const src =
      bestFromSrcset(attrs.srcset || attrs["data-srcset"]) ||
      attrs.src ||
      attrs["data-src"] ||
      attrs["data-zoom"] ||
      attrs["data-original"];
    if (!src) continue;
    images.push({
      src: normalizeImageUrl(src, baseUrl),
      alt: attrs.alt || "",
      width: Number(attrs.width) || 0,
      height: Number(attrs.height) || 0,
      visibleWidth: 0,
      visibleHeight: 0,
      className: attrs.class || "",
      id: attrs.id || ""
    });
  }
  return images;
}

function collectProductCardsFromHtml(html, startUrl) {
  const cards = [];
  const cardRegex = /<li\b[^>]*class=["'][^"']*\bproduct\b[^"']*["'][^>]*>[\s\S]*?<\/li>/gi;
  let match;
  while ((match = cardRegex.exec(html))) {
    const cardHtml = match[0];
    const linkTag = cardHtml.match(/<a\b[^>]*href=["'][^"']+["'][^>]*class=["'][^"']*product-category[^"']*["'][^>]*>/i)?.[0] ||
      cardHtml.match(/<a\b[^>]*href=["'][^"']+["'][^>]*>/i)?.[0];
    if (!linkTag) continue;
    const attrs = attrsFromTag(linkTag);
    if (!attrs.href) continue;
    const href = new URL(attrs.href, startUrl).toString();
    const name = stripTags(cardHtml.match(/<h6\b[^>]*>([\s\S]*?)<\/h6>/i)?.[1] || attrs["aria-label"] || "");
    if (!isLikelyPoolProductPage(href, name)) continue;
    const images = extractImagesFromHtml(cardHtml, startUrl);
    const imageHint = images[0] ? { ...images[0], alt: images[0].alt || name, source: "catalog" } : null;
    cards.push({ url: href, score: scoreProductLink(href, name) + 20, label: name, imageHint });
  }

  const anchorRegex = /<a\b[^>]*href=["'][^"']+["'][^>]*>[\s\S]*?<\/a>/gi;
  while ((match = anchorRegex.exec(html))) {
    const cardHtml = match[0];
    if (!/<img\b/i.test(cardHtml)) continue;
    const linkTag = cardHtml.match(/<a\b[^>]*href=["'][^"']+["'][^>]*>/i)?.[0];
    if (!linkTag) continue;
    const attrs = attrsFromTag(linkTag);
    if (!attrs.href) continue;
    const href = new URL(attrs.href, startUrl).toString();
    if (!sameSite(startUrl, href) || !isLikelyProductCardUrl(href)) continue;
    const images = extractImagesFromHtml(cardHtml, startUrl);
    if (!images.length) continue;
    const name =
      stripTags(cardHtml.match(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/i)?.[1] || "") ||
      images[0].alt ||
      attrs.title ||
      attrs["aria-label"] ||
      "Product";
    const haystack = `${startUrl} ${href} ${name} ${images[0].alt}`.toLowerCase();
    if (!/pool|billiard|table/.test(haystack)) continue;
    const imageHint = { ...images[0], alt: images[0].alt || name, source: "catalog" };
    cards.push({ url: href, score: scoreProductLink(href, name) + 18, label: name, imageHint });
  }
  return cards;
}

function collectStandaloneImageProductsFromHtml(html, startUrl) {
  const parsed = new URL(startUrl);
  const isFgCanada = parsed.hostname.includes("fgbradleys.com") && parsed.pathname.includes("canada-billiard");
  if (!isFgCanada) return [];

  const skipTitle = /logo|series|recreation|classic series|contemporary|design|traditional|rustic|outdoor|commercial|finish|cloth|top thumbnail/i;
  const skipSource = /logo|series-top|Recreationthumbnail|classic-series|ContemporaryThumbnail|design-series|Traditionalthumbnail|Rusticthumbnail|outdoor-top|commercial-top/i;
  return extractImagesFromHtml(html, startUrl)
    .filter((image) => /XLthumbnail|thumbnailXL|pooltable|_XL/i.test(`${image.src} ${image.alt}`))
    .map((image) => {
      const title = productTitleFromImage(image);
      return { image, title };
    })
    .filter((item) => item.title && !skipTitle.test(item.title) && !skipSource.test(item.image.src))
    .map((item) => {
      const slug = slugify(item.title);
      const url = `${startUrl.replace(/\s+$/, "")}#${slug}`;
      return {
        url,
        score: 20,
        label: item.title,
        imageHint: { ...item.image, alt: item.title, source: "standalone-image" },
        directProduct: {
          title: item.title,
          sku: "",
          canonical: url,
          ogImage: item.image.src,
          images: [{ ...item.image, alt: item.title, source: "standalone-image", score: Number.MAX_SAFE_INTEGER / 2 }],
          url
        }
      };
    });
}

function getCatalogImageHint(html, linkHref, baseUrl, label) {
  const absoluteHref = new URL(linkHref, baseUrl).toString();
  const escapedHref = linkHref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedAbsolute = absoluteHref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let linkIndex = html.search(new RegExp(`href=["']${escapedHref}["']`, "i"));
  if (linkIndex < 0) linkIndex = html.search(new RegExp(`href=["']${escapedAbsolute}["']`, "i"));
  if (linkIndex < 0) return null;

  const windowStart = Math.max(0, linkIndex - 1800);
  const windowEnd = Math.min(html.length, linkIndex + 2200);
  const region = html.slice(windowStart, windowEnd);
  const images = extractImagesFromHtml(region, baseUrl);
  const linkSlug = slugify(new URL(linkHref, baseUrl).pathname.split("/").filter(Boolean).pop() || "");
  const labelSlug = slugify(label);

  return images
    .map((image) => {
      const haystack = `${image.src} ${image.alt}`.toLowerCase();
      let score = 0;
      if (haystack.includes(linkSlug.replace(/-/g, "")) || haystack.includes(linkSlug)) score += 100;
      if (labelSlug && haystack.includes(labelSlug)) score += 60;
      if (haystack.includes("pool")) score += 40;
      if (haystack.includes("table")) score += 30;
      if (haystack.includes("room") || haystack.includes("rs") || haystack.includes("environment")) score -= 50;
      if (/-\d+x\d+\.(jpg|jpeg|png|webp)$/i.test(new URL(image.src).pathname)) score += 20;
      return { ...image, alt: image.alt || label, score };
    })
    .sort((a, b) => b.score - a.score)[0] || null;
}

async function collectCandidateLinksFromHtml(startUrl, maxPages) {
  const html = await fetchText(startUrl);
  const links = new Map();
  for (const card of collectProductCardsFromHtml(html, startUrl)) {
    links.set(card.url, card);
  }
  for (const card of collectStandaloneImageProductsFromHtml(html, startUrl)) {
    links.set(card.url, card);
  }
  const regex = /<a\b[^>]*>/gi;
  let match;
  while ((match = regex.exec(html))) {
    const tag = match[0];
    const attrs = attrsFromTag(tag);
    if (!attrs.href) continue;
    const href = new URL(attrs.href, startUrl).toString();
    if (!sameSite(startUrl, href)) continue;
    const labelMatch = html.slice(match.index + tag.length, match.index + tag.length + 300).match(/([^<]+)/);
    const label = stripTags(labelMatch?.[1] || attrs.title || "");
    const clean = new URL(href);
    clean.hash = "";
    const cleanHref = clean.toString();
    if (!isLikelyPoolProductPage(cleanHref, label) && !isLikelyProductCardUrl(cleanHref)) continue;
    const score = scoreProductLink(cleanHref, label);
    if (score < 2) continue;
    const existing = links.get(cleanHref);
    const imageHint = getCatalogImageHint(html, attrs.href, startUrl, label);
    if (!existing || score > existing.score) links.set(cleanHref, { url: cleanHref, score, label, imageHint });
  }
  return [...links.values()]
    .sort((a, b) => b.score - a.score || a.url.localeCompare(b.url))
    .slice(0, maxPages);
}

async function extractPageProductFromHtml(productUrl) {
  const html = await fetchText(productUrl);
  const meta = (name) => {
    const property = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]*>`, "i"))?.[0] || "";
    return attrsFromTag(property).content || "";
  };
  const h1 = stripTags(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
  const title = meta("og:title") || h1 || stripTags(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]) || "Untitled product";
  const canonicalTag = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0] || "";
  const canonical = attrsFromTag(canonicalTag).href ? new URL(attrsFromTag(canonicalTag).href, productUrl).toString() : productUrl;
  const ogImage = meta("og:image");
  const images = extractImagesFromHtml(html, productUrl);

  if (ogImage) {
    images.unshift({
      src: new URL(ogImage, productUrl).toString(),
      alt: "Open Graph product image",
      width: 0,
      height: 0,
      visibleWidth: 0,
      visibleHeight: 0,
      className: "",
      id: ""
    });
  }

  const scoredImages = images
    .map((image) => {
      const haystack = `${image.src} ${image.alt} ${image.className} ${image.id}`.toLowerCase();
      let score = Math.max(image.width * image.height, 350000);
      if (image.source === "catalog") score += 3000000;
      if (haystack.includes("open graph")) score += 500000;
      if (/-\d+x\d+\.(jpg|jpeg|png|webp)$/i.test(new URL(image.src).pathname)) score += 500000;
      if (haystack.includes("pool")) score += 900000;
      if (haystack.includes("billiard")) score += 900000;
      if (haystack.includes("table")) score += 500000;
      if (haystack.includes("product")) score += 350000;
      if (haystack.includes("room") || haystack.includes("roomscene") || haystack.includes("room-scene")) score -= 900000;
      if (haystack.includes("environ")) score -= 700000;
      if (haystack.includes("_rs") || haystack.includes("-rs")) score -= 500000;
      if (haystack.includes("thumb")) score -= 400000;
      if (haystack.includes("logo")) score -= 1200000;
      return { ...image, score };
    })
    .filter((image, index, array) => image.src && image.score > 0 && array.findIndex((item) => item.src === image.src) === index)
    .sort((a, b) => b.score - a.score);

  return { title, sku: "", canonical, ogImage, images: scoredImages, url: productUrl };
}

async function downloadImage(_browserContext, url, productDir, slug) {
  const response = await fetch(url, { headers: { "user-agent": USER_AGENT } });
  if (!response.ok) throw new Error(`Image download failed: ${response.status}`);
  const contentType = response.headers.get("content-type") || "";
  const body = Buffer.from(await response.arrayBuffer());
  const ext = imageExtension(contentType, url);
  const originalPath = path.join(productDir, `original${ext}`);
  fs.writeFileSync(originalPath, body);

  const normalizedPath = path.join(productDir, "normalized.png");
  const thumbPath = path.join(productDir, "thumb.webp");
  await sharp(body)
    .rotate()
    .resize(1600, 1000, { fit: "contain", background: "#ffffff" })
    .png()
    .toFile(normalizedPath);
  await sharp(body)
    .rotate()
    .resize(520, 325, { fit: "cover" })
    .webp({ quality: 82 })
    .toFile(thumbPath);

  return {
    originalPath,
    normalizedPath,
    thumbPath,
    originalUrl: assetPathToUrl(originalPath),
    normalizedUrl: assetPathToUrl(normalizedPath),
    thumbUrl: assetPathToUrl(thumbPath),
    slug
  };
}

async function screenshotBestImage(page, productDir) {
  const handle = await page
    .locator("img")
    .evaluateHandle((imgs) => {
      let best = null;
      let bestScore = 0;
      for (const img of imgs) {
        const rect = img.getBoundingClientRect();
        const score = rect.width * rect.height;
        if (score > bestScore) {
          best = img;
          bestScore = score;
        }
      }
      return best;
    });
  const element = handle.asElement();
  if (!element) throw new Error("No image element found for screenshot fallback.");
  const screenshotPath = path.join(productDir, "original-screenshot.png");
  await element.screenshot({ path: screenshotPath });
  const normalizedPath = path.join(productDir, "normalized.png");
  const thumbPath = path.join(productDir, "thumb.webp");
  await sharp(screenshotPath)
    .resize(1600, 1000, { fit: "contain", background: "#ffffff" })
    .png()
    .toFile(normalizedPath);
  await sharp(screenshotPath).resize(520, 325, { fit: "cover" }).webp({ quality: 82 }).toFile(thumbPath);
  return {
    originalPath: screenshotPath,
    normalizedPath,
    thumbPath,
    originalUrl: assetPathToUrl(screenshotPath),
    normalizedUrl: assetPathToUrl(normalizedPath),
    thumbUrl: assetPathToUrl(thumbPath)
  };
}

async function crawlSite({ url, vendor = "", maxPages = 24 }) {
  const startedAt = new Date().toISOString();
  let browser = null;
  let context = null;
  let page = null;
  const products = readJson(PRODUCTS_FILE, []);
  const run = {
    id: makeId(`${url}-${startedAt}`),
    url,
    vendor,
    startedAt,
    finishedAt: null,
    status: "running",
    foundPages: 0,
    savedProducts: 0,
    errors: []
  };

  try {
    try {
      browser = await chromium.launch({ headless: true });
      context = await browser.newContext({
        userAgent: USER_AGENT,
        viewport: { width: 1440, height: 1200 }
      });
      page = await context.newPage();
    } catch (error) {
      run.errors.push({
        url,
        message: "Browser capture is unavailable on this computer, so the importer used direct page/image scanning."
      });
    }

    const links = await collectCandidateLinks(page, url, Math.max(1, Math.min(Number(maxPages) || 24, 120)));
    run.foundPages = links.length;

    for (const link of links) {
      try {
        const product = link.directProduct || (await extractPageProduct(page, link.url));
        if (link.label && (product.url.includes("/shop?productId=") || product.title === "Untitled product")) {
          product.title = link.label;
        }
        if (link.imageHint) {
          product.images.unshift({
            ...link.imageHint,
            source: "catalog",
            score: Number.MAX_SAFE_INTEGER / 2
          });
        }
        if (!product.images.length) {
          run.errors.push({ url: link.url, message: "No usable product image found." });
          continue;
        }

        const id = makeId(product.canonical || product.url);
        const slug = `${slugify(product.title)}-${id}`;
        const productDir = path.join(ASSETS_DIR, slug);
        fs.mkdirSync(productDir, { recursive: true });

        let files;
        try {
          files = await downloadImage(context, product.images[0].src, productDir, slug);
        } catch {
          if (!page) throw new Error("The best image could not be downloaded.");
          files = await screenshotBestImage(page, productDir);
        }

        const record = {
          id,
          vendor: vendor || new URL(url).hostname,
          title: product.title,
          sku: product.sku,
          sourceUrl: product.url,
          canonicalUrl: product.canonical,
          selectedImageUrl: product.images[0].src,
          importedAt: new Date().toISOString(),
          image: {
            original: files.originalUrl,
            normalized: files.normalizedUrl,
            thumb: files.thumbUrl,
            width: 1600,
            height: 1000
          },
          candidates: product.images.slice(0, 8).map((image) => ({
            src: image.src,
            alt: image.alt,
            width: image.width,
            height: image.height,
            score: Math.round(image.score)
          }))
        };

        const existingIndex = products.findIndex((item) => item.id === record.id);
        if (existingIndex >= 0) products[existingIndex] = record;
        else products.push(record);
        writeJson(PRODUCTS_FILE, products);
        run.savedProducts += 1;
      } catch (error) {
        run.errors.push({ url: link.url, message: error.message });
      }
    }

    run.status = "complete";
    return run;
  } catch (error) {
    run.status = "failed";
    run.errors.push({ url, message: error.message });
    return run;
  } finally {
    run.finishedAt = new Date().toISOString();
    const runs = readJson(RUNS_FILE, []);
    runs.unshift(run);
    writeJson(RUNS_FILE, runs.slice(0, 30));
    if (browser) await browser.close();
  }
}

function toSafeWorkbenchPath(relativePath) {
  const filePath = path.normalize(path.join(CALIFORNIA_WORKBENCH_DIR, relativePath || ""));
  if (!filePath.startsWith(CALIFORNIA_WORKBENCH_DIR)) throw new Error("Invalid workbench file path.");
  return filePath;
}

function makeChecker(width, height) {
  const checker = Buffer.alloc(width * height * 4);
  const square = 48;
  for (let i = 0, p = 0; p < width * height; i += 4, p++) {
    const x = p % width;
    const y = Math.floor(p / width);
    const isLight = (Math.floor(x / square) + Math.floor(y / square)) % 2 === 0;
    checker[i] = isLight ? 238 : 198;
    checker[i + 1] = isLight ? 242 : 207;
    checker[i + 2] = isLight ? 244 : 212;
    checker[i + 3] = 255;
  }
  return checker;
}

function validateCutoutPoints(points) {
  if (!Array.isArray(points) || points.length < 3) throw new Error("Add at least 3 waypoints around the cloth.");
  if (points.length > 40) throw new Error("Use 40 waypoints or fewer for one cloth area.");
  return points.map((point) => {
    const x = Number(point.x);
    const y = Number(point.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error("One waypoint is invalid.");
    return {
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y))
    };
  });
}

async function saveManualClothCutout({ slug, points }) {
  if (!/^[a-z0-9-]+$/.test(String(slug || ""))) throw new Error("Invalid table selection.");
  const tables = readJson(CALIFORNIA_WORKBENCH_FILE, []);
  const tableIndex = tables.findIndex((table) => table.slug === slug);
  if (tableIndex < 0) throw new Error("Table not found.");

  const table = tables[tableIndex];
  const safePoints = validateCutoutPoints(points);
  const tablePath = toSafeWorkbenchPath(table.tableFile);
  const image = sharp(tablePath).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const pixelPoints = safePoints.map((point) => ({
    x: Math.round(point.x * width),
    y: Math.round(point.y * height)
  }));
  const polygon = pixelPoints.map((point) => `${point.x},${point.y}`).join(" ");
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="black"/><polygon points="${polygon}" fill="white"/></svg>`
  );
  const { data: mask } = await sharp(svg).blur(0.65).greyscale().raw().toBuffer({ resolveWithObject: true });

  const cutout = Buffer.from(data);
  for (let i = 0, p = 0; i < cutout.length; i += 4, p++) {
    if (mask[p] <= 0) continue;
    cutout[i + 3] = Math.max(0, Math.round(cutout[i + 3] * (1 - mask[p] / 255)));
  }

  const maskFile = path.join(CLOTH_MASK_DIR, `${slug}-cloth-manual-mask.png`);
  const removedFile = path.join(CLOTH_REMOVED_DIR, `${slug}-cloth-removed.png`);
  const previewFile = path.join(CLOTH_REMOVED_PREVIEW_DIR, `${slug}-checker-preview.png`);
  const exportFile = path.join(CLOTH_EXPORT_DIR, `${slug}-cloth-removed.png`);

  await sharp(Buffer.from(mask), { raw: { width, height, channels: 1 } }).png().toFile(maskFile);
  await sharp(cutout, { raw: { width, height, channels: 4 } }).png().toFile(removedFile);
  await sharp(makeChecker(width, height), { raw: { width, height, channels: 4 } })
    .composite([{ input: cutout, raw: { width, height, channels: 4 } }])
    .png()
    .toFile(previewFile);
  fs.copyFileSync(removedFile, exportFile);

  const now = new Date().toISOString();
  table.masks = table.masks || {};
  table.masks.cloth = path.relative(CALIFORNIA_WORKBENCH_DIR, maskFile).replace(/\\/g, "/");
  table.clothRemovedFile = path.relative(CALIFORNIA_WORKBENCH_DIR, removedFile).replace(/\\/g, "/");
  table.clothRemovedPreviewFile = path.relative(CALIFORNIA_WORKBENCH_DIR, previewFile).replace(/\\/g, "/");
  table.manualCutout = { points: safePoints, updatedAt: now };
  tables[tableIndex] = table;
  writeJson(CALIFORNIA_WORKBENCH_FILE, tables);
  writeJson(path.join(MANUAL_CUTOUT_DIR, `${slug}.json`), { slug, title: table.title, points: safePoints, updatedAt: now });

  return {
    ok: true,
    table,
    files: {
      transparentPng: assetPathToUrl(removedFile),
      checkerPreview: assetPathToUrl(previewFile),
      exportPng: assetPathToUrl(exportFile)
    }
  };
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

async function fileBlob(filePath) {
  return new Blob([fs.readFileSync(filePath)], { type: getMimeType(filePath) });
}

function aiRenderPrompt(table, finish) {
  return [
    "Edit the pool table product photo using the reference finish swatch.",
    "",
    `Table: ${table.title}`,
    `Target wood finish: ${finish.name}`,
    "",
    "Use the first image as the table to preserve. Use the second image only as the wood finish/material reference.",
    "Keep the exact same camera angle, table proportions, silhouette, rails, pockets, legs, hardware, shadows, and white studio background.",
    "Change only the visible wood or cabinet finish to match the swatch color, grain, gloss, and distressed/glazed character.",
    "Do not change the table design, do not add objects, do not add text, logos, labels, watermarks, people, rooms, or decorations.",
    "Keep this as a clean catalog product photo on white background."
  ].join("\n");
}

async function applySavedClothCutout(renderFile, table) {
  const maskFile = table.masks?.cloth ? path.join(CALIFORNIA_WORKBENCH_DIR, table.masks.cloth) : "";
  if (!maskFile || !fs.existsSync(maskFile)) return renderFile;
  const base = sharp(renderFile).ensureAlpha().resize(1600, 1000, { fit: "contain", background: "#ffffff" });
  const { data, info } = await base.raw().toBuffer({ resolveWithObject: true });
  const { data: mask } = await sharp(maskFile).resize(info.width, info.height, { fit: "fill" }).greyscale().raw().toBuffer({
    resolveWithObject: true
  });
  const out = Buffer.from(data);
  for (let i = 0, p = 0; i < out.length; i += 4, p++) {
    if (mask[p] > 0) out[i + 3] = Math.max(0, Math.round(out[i + 3] * (1 - mask[p] / 255)));
  }
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(renderFile);
  return renderFile;
}

async function renderAiFinish({ tableSlug, finishSlug, apiKey }) {
  const key = apiKey || process.env.OPENAI_API_KEY;
  if (!key) throw new Error("Add an OpenAI API key to render. The key is used once and is not saved.");
  if (!/^sk-/.test(String(key))) throw new Error("That API key does not look valid.");
  const tables = readJson(CALIFORNIA_WORKBENCH_FILE, []);
  const finishes = readJson(path.join(CALIFORNIA_WORKBENCH_DIR, "finish-library.json"), []);
  const table = tables.find((item) => item.slug === tableSlug);
  const finish = finishes.find((item) => item.slug === finishSlug);
  if (!table) throw new Error("Choose a table.");
  if (!finish) throw new Error("Choose a finish.");

  const tableFile = path.join(CALIFORNIA_WORKBENCH_DIR, table.clothRemovedFile || table.tableFile);
  const finishFile = path.join(CALIFORNIA_WORKBENCH_DIR, finish.file);
  const prompt = aiRenderPrompt(table, finish);
  const form = new FormData();
  form.append("model", "gpt-image-2");
  form.append("prompt", prompt);
  form.append("size", "1600x1008");
  form.append("quality", "medium");
  form.append("output_format", "png");
  form.append("image[]", await fileBlob(tableFile), `${table.slug}.png`);
  form.append("image[]", await fileBlob(finishFile), `${finish.slug}${path.extname(finishFile)}`);

  const response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { authorization: `Bearer ${key}` },
    body: form
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.error?.message || `AI render failed with status ${response.status}.`);
  }
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error("The AI render response did not include an image.");

  const finishDir = path.join(AI_RENDER_DIR, finish.slug);
  const exportDir = path.join(AI_RENDER_EXPORT_DIR, finish.slug);
  fs.mkdirSync(finishDir, { recursive: true });
  fs.mkdirSync(exportDir, { recursive: true });
  const fileName = `${table.slug}__${finish.slug}__ai.png`;
  const renderFile = path.join(finishDir, fileName);
  fs.writeFileSync(renderFile, Buffer.from(b64, "base64"));
  await applySavedClothCutout(renderFile, table);
  const exportFile = path.join(exportDir, fileName);
  fs.copyFileSync(renderFile, exportFile);

  const recordFile = path.join(AI_RENDER_DIR, "manifest.json");
  const manifest = readJson(recordFile, { renders: [] });
  const record = {
    table: table.title,
    tableSlug: table.slug,
    finish: finish.name,
    finishSlug: finish.slug,
    file: path.relative(CALIFORNIA_WORKBENCH_DIR, renderFile).replace(/\\/g, "/"),
    exportFile: assetPathToUrl(exportFile),
    prompt,
    renderedAt: new Date().toISOString()
  };
  manifest.renders = [record, ...manifest.renders.filter((item) => !(item.tableSlug === table.slug && item.finishSlug === finish.slug))];
  writeJson(recordFile, manifest);
  return { ok: true, render: record };
}

function sendJson(res, status, value) {
  const body = Buffer.from(JSON.stringify(value, null, 2));
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": body.length
  });
  res.end(body);
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".cmd": "text/plain; charset=utf-8"
  };
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "content-type": types[ext] || "application/octet-stream" });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://localhost:${PORT}`);

  try {
    if (req.method === "GET" && requestUrl.pathname === "/api/products") {
      return sendJson(res, 200, readJson(PRODUCTS_FILE, []));
    }
    if (req.method === "GET" && requestUrl.pathname === "/api/runs") {
      return sendJson(res, 200, readJson(RUNS_FILE, []));
    }
    if (req.method === "DELETE" && requestUrl.pathname.startsWith("/api/products/")) {
      const id = decodeURIComponent(requestUrl.pathname.replace("/api/products/", ""));
      const products = readJson(PRODUCTS_FILE, []);
      const nextProducts = products.filter((product) => product.id !== id);
      if (nextProducts.length === products.length) return sendJson(res, 404, { error: "Product not found." });
      writeJson(PRODUCTS_FILE, nextProducts);
      return sendJson(res, 200, { ok: true });
    }
    if (req.method === "POST" && requestUrl.pathname === "/api/crawl") {
      const body = await getBody(req);
      if (!body.url || !/^https?:\/\//i.test(body.url)) {
        return sendJson(res, 400, { error: "Enter a full website URL starting with http:// or https://" });
      }
      const run = await crawlSite(body);
      return sendJson(res, run.status === "failed" ? 500 : 200, run);
    }
    if (req.method === "POST" && requestUrl.pathname === "/api/cloth-cutout") {
      const body = await getBody(req);
      const result = await saveManualClothCutout(body);
      return sendJson(res, 200, result);
    }
    if (req.method === "POST" && requestUrl.pathname === "/api/ai-render") {
      const body = await getBody(req);
      const result = await renderAiFinish(body);
      return sendJson(res, 200, result);
    }
    if (requestUrl.pathname.startsWith("/data/assets/")) {
      const filePath = path.normalize(path.join(ROOT, requestUrl.pathname));
      if (!filePath.startsWith(ASSETS_DIR)) return sendJson(res, 403, { error: "Forbidden" });
      return sendFile(res, filePath);
    }
    if (requestUrl.pathname.startsWith("/finish-workbench/")) {
      const workbenchDir = path.join(ROOT, "finish-workbench");
      const filePath = path.normalize(path.join(ROOT, requestUrl.pathname));
      if (!filePath.startsWith(workbenchDir)) return sendJson(res, 403, { error: "Forbidden" });
      return sendFile(res, filePath);
    }
    if (requestUrl.pathname.startsWith("/exports/")) {
      const exportDir = path.join(ROOT, "exports");
      const filePath = path.normalize(path.join(ROOT, requestUrl.pathname));
      if (!filePath.startsWith(exportDir)) return sendJson(res, 403, { error: "Forbidden" });
      return sendFile(res, filePath);
    }

    const safePath = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
    const filePath = path.normalize(path.join(PUBLIC_DIR, safePath));
    if (!filePath.startsWith(PUBLIC_DIR)) return sendJson(res, 403, { error: "Forbidden" });
    return sendFile(res, filePath);
  } catch (error) {
    return sendJson(res, 500, { error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Pool table image importer running at http://localhost:${PORT}`);
  console.log("Press Ctrl+C to stop.");
});
