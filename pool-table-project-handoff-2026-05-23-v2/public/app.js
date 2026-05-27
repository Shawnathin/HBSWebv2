const form = document.querySelector("#crawlForm");
const statusEl = document.querySelector("#status");
const productsEl = document.querySelector("#products");
const runsEl = document.querySelector("#runsList");
const productCountEl = document.querySelector("#productCount");
const runCountEl = document.querySelector("#runCount");
const refreshButton = document.querySelector("#refreshButton");
const crawlButton = document.querySelector("#crawlButton");
const previewPanel = document.querySelector("#previewPanel");
const previewTitle = document.querySelector("#previewTitle");
const previewMeta = document.querySelector("#previewMeta");
const previewImage = document.querySelector("#previewImage");
const previewOriginal = document.querySelector("#previewOriginal");
const previewSource = document.querySelector("#previewSource");
const closePreview = document.querySelector("#closePreview");

let savedProducts = [];

function setStatus(message, isWarning = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("warn", isWarning);
}

function hostName(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function renderProducts(products) {
  savedProducts = products;
  productCountEl.textContent = String(products.length);
  if (!products.length) {
    productsEl.innerHTML = '<p class="empty">No product images imported yet.</p>';
    return;
  }

  productsEl.innerHTML = products
    .map(
      (product) => `
        <article class="product">
          <img src="${product.image.thumb}" alt="${escapeHtml(product.title)}" loading="lazy">
          <div class="product-body">
            <h3>${escapeHtml(product.title)}</h3>
            <p>${escapeHtml(product.vendor)}${product.sku ? ` · ${escapeHtml(product.sku)}` : ""}</p>
            <p>${escapeHtml(hostName(product.sourceUrl))}</p>
            <div class="product-actions">
              <button class="text-button" type="button" data-action="preview" data-id="${product.id}">Review image</button>
              <a href="${product.image.original}" target="_blank" rel="noreferrer">Original</a>
              <a href="${product.sourceUrl}" target="_blank" rel="noreferrer">Source page</a>
              <button class="text-button danger" type="button" data-action="remove" data-id="${product.id}">Remove</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderRuns(runs) {
  runCountEl.textContent = String(runs.length);
  if (!runs.length) {
    runsEl.innerHTML = '<p class="empty">No imports run yet.</p>';
    return;
  }

  runsEl.innerHTML = runs
    .slice(0, 8)
    .map(
      (run) => `
        <div class="run-item">
          <strong>${escapeHtml(run.status)} · ${run.savedProducts} saved</strong>
          <span>${escapeHtml(hostName(run.url))}</span>
          <span>${run.foundPages} pages found · ${run.errors.length} warnings</span>
        </div>
      `
    )
    .join("");
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function refresh() {
  const [productsResponse, runsResponse] = await Promise.all([fetch("/api/products"), fetch("/api/runs")]);
  const products = await productsResponse.json();
  const runs = await runsResponse.json();
  renderProducts(products);
  renderRuns(runs);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  data.maxPages = Number(data.maxPages || 24);
  crawlButton.disabled = true;
  setStatus("Importing pages and saving images. This can take a minute for larger collections.");
  crawlButton.textContent = "Importing...";

  try {
    const response = await fetch("/api/crawl", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Import failed.");
    const warning = result.errors.length ? ` ${result.errors.length} pages need review.` : "";
    setStatus(`Done. Saved ${result.savedProducts} product images.${warning}`, Boolean(result.errors.length));
    await refresh();
    document.querySelector(".products-wrap").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    crawlButton.disabled = false;
    crawlButton.textContent = "Start Import";
  }
});

refreshButton.addEventListener("click", refresh);
closePreview.addEventListener("click", () => {
  previewPanel.hidden = true;
});

productsEl.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const product = savedProducts.find((item) => item.id === target.dataset.id);
  if (!product) return;

  if (target.dataset.action === "preview") {
    previewTitle.textContent = product.title;
    previewMeta.textContent = `${product.vendor} · ${hostName(product.sourceUrl)}`;
    previewImage.src = product.image.normalized;
    previewImage.alt = product.title;
    previewOriginal.href = product.image.original;
    previewSource.href = product.sourceUrl;
    previewPanel.hidden = false;
    previewPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  if (target.dataset.action === "remove") {
    target.disabled = true;
    setStatus(`Removing ${product.title}...`);
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(product.id)}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not remove product.");
      if (previewImage.src.includes(product.image.normalized)) previewPanel.hidden = true;
      await refresh();
      setStatus(`Removed ${product.title}.`);
    } catch (error) {
      setStatus(error.message, true);
      target.disabled = false;
    }
  }
});
refresh();
