import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..");
const publicRoot = path.join(__dirname, "public");
const outputRoot = path.join(workspaceRoot, "scraped-products");
const catalogPath = path.join(outputRoot, "catalog.json");
const port = Number(process.env.PORT || 4177);
const host = process.env.HOST || "127.0.0.1";

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".gif", "image/gif"],
  [".svg", "image/svg+xml"]
]);

function slugify(value, fallback = "item") {
  const slug = String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || fallback;
}

function decodeHtml(value = "") {
  const named = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: "\""
  };

  return String(value)
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([a-f0-9]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => named[name.toLowerCase()] || match);
}

function textFromHtml(value = "") {
  return decodeHtml(
    String(value)
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/[ \t\r\f\v]+/g, " ")
      .replace(/\n\s+/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

function getAttributes(tag = "") {
  const attributes = {};
  const pattern = /([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;

  while ((match = pattern.exec(tag))) {
    const key = match[1].toLowerCase();
    if (key === tag.match(/^<\s*([\w-]+)/)?.[1]?.toLowerCase()) continue;
    attributes[key] = decodeHtml(match[2] ?? match[3] ?? match[4] ?? "");
  }

  return attributes;
}

function extractTags(html, tagName) {
  const pattern = new RegExp(`<${tagName}\\b[^>]*>`, "gi");
  return html.match(pattern) || [];
}

function extractMeta(html) {
  const meta = {};

  for (const tag of extractTags(html, "meta")) {
    const attrs = getAttributes(tag);
    const key = attrs.property || attrs.name || attrs.itemprop;
    if (key && attrs.content) meta[key.toLowerCase()] = attrs.content;
  }

  return meta;
}

function extractTitle(html, meta) {
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  return textFromHtml(meta["og:title"] || meta["twitter:title"] || title || "");
}

function extractJsonLd(html) {
  const scripts = [];
  const pattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = pattern.exec(html))) {
    const raw = decodeHtml(match[1].trim());
    try {
      scripts.push(JSON.parse(raw));
    } catch {
      const cleaned = raw.replace(/,\s*([}\]])/g, "$1");
      try {
        scripts.push(JSON.parse(cleaned));
      } catch {
        // Some stores emit malformed JSON-LD. The rest of the scraper still works.
      }
    }
  }

  return scripts;
}

function flattenJsonLd(nodes) {
  const queue = Array.isArray(nodes) ? [...nodes] : [nodes];
  const flattened = [];

  while (queue.length) {
    const item = queue.shift();
    if (!item || typeof item !== "object") continue;
    flattened.push(item);
    if (Array.isArray(item)) queue.push(...item);
    if (Array.isArray(item["@graph"])) queue.push(...item["@graph"]);
  }

  return flattened;
}

function isProductNode(node) {
  const type = node?.["@type"];
  if (Array.isArray(type)) return type.some((value) => String(value).toLowerCase() === "product");
  return String(type || "").toLowerCase() === "product";
}

function collectJsonLdImages(value, images = []) {
  if (!value) return images;
  if (typeof value === "string") images.push(value);
  if (Array.isArray(value)) value.forEach((item) => collectJsonLdImages(item, images));
  if (typeof value === "object") {
    collectJsonLdImages(value.url, images);
    collectJsonLdImages(value.contentUrl, images);
  }
  return images;
}

function firstSrcsetUrl(srcset = "") {
  const candidates = srcset
    .split(",")
    .map((part) => part.trim().split(/\s+/)[0])
    .filter(Boolean);

  return candidates.at(-1) || "";
}

function resolveUrl(value, baseUrl) {
  if (!value || String(value).startsWith("data:")) return "";

  try {
    return new URL(value, baseUrl).href;
  } catch {
    return "";
  }
}

function isLikelyDecorativeImage(url) {
  const lowered = url.toLowerCase();
  return [
    "favicon",
    "sprite",
    "icon-",
    "/icon",
    "logo",
    "placeholder",
    "tracking",
    "pixel."
  ].some((needle) => lowered.includes(needle));
}

function uniqueImages(images, baseUrl, maxImages) {
  const seen = new Set();
  const output = [];

  for (const item of images) {
    const url = resolveUrl(item.url || item, baseUrl);
    if (!url || seen.has(url) || isLikelyDecorativeImage(url)) continue;
    seen.add(url);
    output.push({
      url,
      alt: item.alt || ""
    });
    if (output.length >= maxImages) break;
  }

  return output;
}

function extractImages(html, baseUrl, meta, productNode, maxImages) {
  const images = [];

  for (const key of ["og:image", "og:image:url", "twitter:image", "twitter:image:src"]) {
    if (meta[key]) images.push({ url: meta[key], alt: "Primary product image" });
  }

  collectJsonLdImages(productNode?.image).forEach((url) => {
    images.push({ url, alt: productNode?.name || "Product image" });
  });

  for (const tag of extractTags(html, "img")) {
    const attrs = getAttributes(tag);
    const url =
      attrs.src ||
      attrs["data-src"] ||
      attrs["data-original"] ||
      attrs["data-lazy-src"] ||
      attrs["data-zoom-image"] ||
      firstSrcsetUrl(attrs.srcset || attrs["data-srcset"]);

    images.push({ url, alt: attrs.alt || attrs.title || "" });
  }

  return uniqueImages(images, baseUrl, maxImages);
}

function extractSimpleSelector(html, selector) {
  const trimmed = String(selector || "").trim();
  if (!trimmed) return "";

  if (/^meta\[/i.test(trimmed)) {
    const attrMatch = trimmed.match(/\[(name|property|itemprop)=["']?([^"'\]]+)/i);
    const wantedAttr = attrMatch?.[1]?.toLowerCase();
    const wantedValue = attrMatch?.[2]?.toLowerCase();
    for (const tag of extractTags(html, "meta")) {
      const attrs = getAttributes(tag);
      if (attrs[wantedAttr] && attrs[wantedAttr].toLowerCase() === wantedValue) {
        return attrs.content || "";
      }
    }
  }

  if (trimmed.startsWith("#")) {
    const id = trimmed.slice(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`<([\\w-]+)\\b[^>]*\\bid=["'][^"']*${id}[^"']*["'][^>]*>([\\s\\S]*?)<\\/\\1>`, "i");
    return textFromHtml(html.match(pattern)?.[2] || "");
  }

  if (trimmed.startsWith(".")) {
    const className = trimmed.slice(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`<([\\w-]+)\\b[^>]*\\bclass=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/\\1>`, "i");
    return textFromHtml(html.match(pattern)?.[2] || "");
  }

  if (/^[a-z][\w-]*$/i.test(trimmed)) {
    const pattern = new RegExp(`<${trimmed}\\b[^>]*>([\\s\\S]*?)<\\/${trimmed}>`, "i");
    return textFromHtml(html.match(pattern)?.[1] || "");
  }

  return "";
}

function extractParagraphDescription(html) {
  const paragraphs = [];
  const pattern = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  let match;

  while ((match = pattern.exec(html))) {
    const text = textFromHtml(match[1]);
    const lowered = text.toLowerCase();
    if (text.length < 70 || text.length > 1600) continue;
    if (/(cookie|privacy|newsletter|subscribe|copyright|shipping|returns)/i.test(lowered)) continue;
    paragraphs.push(text);
  }

  return paragraphs.sort((a, b) => b.length - a.length)[0] || "";
}

function extractDescription(html, meta, productNode, selector) {
  const selected = extractSimpleSelector(html, selector);
  const description =
    selected ||
    productNode?.description ||
    meta["og:description"] ||
    meta["description"] ||
    meta["twitter:description"] ||
    extractParagraphDescription(html);

  return textFromHtml(description).slice(0, 2500);
}

function inferImageExtension(url, contentType) {
  const fromType = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif"
  }[String(contentType || "").split(";")[0].toLowerCase()];

  if (fromType) return fromType;

  try {
    const ext = path.extname(new URL(url).pathname).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) return ext;
  } catch {
    // Fall through to the safest browser-friendly image extension.
  }

  return ".jpg";
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36 ProductScraper/1.0",
        accept: "*/*",
        ...(options.headers || {})
      }
    });
  } finally {
    clearTimeout(timer);
  }
}

async function downloadImages(images, productDir) {
  const saved = [];

  for (const [index, image] of images.entries()) {
    try {
      const response = await fetchWithTimeout(image.url, {}, 30000);
      const contentType = response.headers.get("content-type") || "";
      if (!response.ok || !contentType.toLowerCase().startsWith("image/")) continue;

      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.byteLength < 512) continue;

      const extension = inferImageExtension(image.url, contentType);
      const sourceName = slugify(path.basename(new URL(image.url).pathname, extension), "image");
      const fileName = `${String(index + 1).padStart(2, "0")}-${sourceName}${extension}`;
      const absolutePath = path.join(productDir, fileName);

      await fs.writeFile(absolutePath, buffer);
      saved.push({
        file: fileName,
        bytes: buffer.byteLength,
        contentType,
        originalUrl: image.url,
        alt: image.alt
      });
    } catch {
      saved.push({
        file: "",
        skipped: true,
        originalUrl: image.url,
        alt: image.alt
      });
    }
  }

  return saved.filter((image) => image.file);
}

async function readCatalog() {
  try {
    return JSON.parse(await fs.readFile(catalogPath, "utf8"));
  } catch {
    return {
      updatedAt: null,
      outputFolder: outputRoot,
      productCount: 0,
      products: []
    };
  }
}

async function writeCatalog(product) {
  await fs.mkdir(outputRoot, { recursive: true });
  const catalog = await readCatalog();
  const withoutDuplicate = catalog.products.filter((item) => item.id !== product.id);
  const products = [product, ...withoutDuplicate].sort((a, b) =>
    `${a.productLine}/${a.title}`.localeCompare(`${b.productLine}/${b.title}`)
  );

  const nextCatalog = {
    updatedAt: new Date().toISOString(),
    outputFolder: outputRoot,
    productCount: products.length,
    products
  };

  await fs.writeFile(catalogPath, `${JSON.stringify(nextCatalog, null, 2)}\n`);
  return nextCatalog;
}

function productMarkdown(product) {
  const imageLines = product.images
    .map((image) => `- ${image.file}${image.alt ? ` (${image.alt})` : ""}`)
    .join("\n");

  return `# ${product.title}

Product line: ${product.productLine}
Source: ${product.sourceUrl}
Scraped: ${product.scrapedAt}

## Description

${product.description || "No description found."}

## Images

${imageLines || "No images saved."}
`;
}

async function scrapeProduct(payload) {
  const sourceUrl = String(payload.url || "").trim();
  if (!sourceUrl) throw new Error("Add a product page URL.");

  const parsedUrl = new URL(sourceUrl);
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Use an http or https URL.");
  }

  const productLine = String(payload.productLine || "Unsorted").trim();
  const maxImages = Math.max(1, Math.min(Number(payload.maxImages || 12), 36));
  const response = await fetchWithTimeout(parsedUrl.href, { headers: { accept: "text/html,*/*" } }, 30000);

  if (!response.ok) {
    throw new Error(`The page returned ${response.status} ${response.statusText}.`);
  }

  const html = await response.text();
  const meta = extractMeta(html);
  const jsonLd = flattenJsonLd(extractJsonLd(html));
  const productNode = jsonLd.find(isProductNode) || {};
  const title = textFromHtml(payload.productName || productNode.name || extractTitle(html, meta) || parsedUrl.hostname);
  const description = extractDescription(html, meta, productNode, payload.descriptionSelector);
  const imageCandidates = extractImages(html, parsedUrl.href, meta, productNode, maxImages);

  const lineSlug = slugify(productLine, "unsorted");
  const productSlug = slugify(title, "product");
  const productDir = path.join(outputRoot, lineSlug, productSlug);
  const relativeDir = path.relative(workspaceRoot, productDir);

  await fs.mkdir(productDir, { recursive: true });
  const images = await downloadImages(imageCandidates, productDir);

  const product = {
    id: `${lineSlug}/${productSlug}`,
    title,
    productLine,
    sourceUrl: parsedUrl.href,
    scrapedAt: new Date().toISOString(),
    description,
    folder: relativeDir,
    images,
    candidatesFound: imageCandidates.length
  };

  await fs.writeFile(path.join(productDir, "product.json"), `${JSON.stringify(product, null, 2)}\n`);
  await fs.writeFile(path.join(productDir, "product.md"), productMarkdown(product));
  const catalog = await writeCatalog(product);

  return {
    product,
    catalog,
    outputRoot
  };
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.byteLength;
    if (size > 1024 * 1024) throw new Error("Request is too large.");
    chunks.push(chunk);
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function sendJson(response, status, data) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(`${JSON.stringify(data, null, 2)}\n`);
}

async function sendFile(response, filePath, allowedRoot) {
  const normalized = path.normalize(filePath);

  if (!normalized.startsWith(allowedRoot)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const buffer = await fs.readFile(normalized);
    response.writeHead(200, {
      "content-type": mimeTypes.get(path.extname(normalized).toLowerCase()) || "application/octet-stream"
    });
    response.end(buffer);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}

async function sendStatic(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const requestedPath = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;

  if (requestedPath.startsWith("/scraped-products/")) {
    const filePath = path.join(workspaceRoot, requestedPath);
    await sendFile(response, filePath, outputRoot);
    return;
  }

  await sendFile(response, path.join(publicRoot, requestedPath), publicRoot);
}

const server = http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url, `http://${request.headers.host}`);

    if (request.method === "GET" && requestUrl.pathname === "/api/products") {
      await fs.mkdir(outputRoot, { recursive: true });
      sendJson(response, 200, await readCatalog());
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/scrape") {
      const payload = await readJsonBody(request);
      sendJson(response, 200, await scrapeProduct(payload));
      return;
    }

    if (request.method === "GET") {
      await sendStatic(request, response);
      return;
    }

    response.writeHead(405);
    response.end("Method not allowed");
  } catch (error) {
    sendJson(response, 400, {
      error: error.message || "Something went wrong."
    });
  }
});

server.listen(port, host, () => {
  console.log(`Product scraper running at http://${host}:${port}`);
  console.log(`Saving products to ${outputRoot}`);
});
