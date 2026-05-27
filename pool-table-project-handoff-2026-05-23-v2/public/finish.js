const root = "/finish-workbench/california-house/";
const swatchesEl = document.querySelector("#swatches");
const tablesEl = document.querySelector("#tables");
const tableCountEl = document.querySelector("#tableCount");
const finishCountEl = document.querySelector("#finishCount");
const finishRenderSelectEl = document.querySelector("#finishRenderSelect");
const finishRendersEl = document.querySelector("#finishRenders");
const aiTableSelectEl = document.querySelector("#aiTableSelect");
const aiFinishSelectEl = document.querySelector("#aiFinishSelect");
const aiApiKeyEl = document.querySelector("#aiApiKey");
const aiRenderBtnEl = document.querySelector("#aiRenderBtn");
const aiBatchRenderBtnEl = document.querySelector("#aiBatchRenderBtn");
const aiRenderStatusEl = document.querySelector("#aiRenderStatus");
const aiRenderResultEl = document.querySelector("#aiRenderResult");

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function load() {
  const [finishes, tables, renderManifest] = await Promise.all([
    fetch(`${root}finish-library.json`).then((response) => response.json()),
    fetch(`${root}table-workbench.json`).then((response) => response.json()),
    fetch(`${root}finish-render-manifest.json`).then((response) => (response.ok ? response.json() : null))
  ]);

  finishCountEl.textContent = finishes.length;
  tableCountEl.textContent = tables.length;

  swatchesEl.innerHTML = finishes
    .map(
      (finish) => `
        <article class="swatch">
          <img src="${root}${finish.file}" alt="${escapeHtml(finish.name)}" loading="lazy">
          <strong>${escapeHtml(finish.name)}</strong>
        </article>
      `
    )
    .join("");

  aiTableSelectEl.innerHTML = tables
    .map((table) => `<option value="${escapeHtml(table.slug)}">${escapeHtml(table.title)}</option>`)
    .join("");
  aiFinishSelectEl.innerHTML = finishes
    .map((finish) => `<option value="${escapeHtml(finish.slug)}">${escapeHtml(finish.name)}</option>`)
    .join("");

  const setAiButtons = (isDisabled) => {
    aiRenderBtnEl.disabled = isDisabled;
    aiBatchRenderBtnEl.disabled = isDisabled;
  };

  const renderAiImage = async (tableSlug, finishSlug, apiKey) => {
    const response = await fetch("/api/ai-render", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tableSlug, finishSlug, apiKey })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Render failed.");
    return result.render;
  };

  const renderResultCard = (render) => `
    <article>
      <img src="${root}${render.file}?v=${Date.now()}" alt="${escapeHtml(render.table)} ${escapeHtml(render.finish)} AI render">
      <a href="${root}${render.file}" target="_blank" rel="noreferrer">${escapeHtml(render.finish)}</a>
    </article>
  `;

  aiRenderBtnEl.addEventListener("click", async () => {
    setAiButtons(true);
    aiRenderStatusEl.textContent = "Rendering. This can take a minute or two.";
    aiRenderResultEl.innerHTML = "";
    try {
      const render = await renderAiImage(aiTableSelectEl.value, aiFinishSelectEl.value, aiApiKeyEl.value.trim());
      aiRenderStatusEl.textContent = `Rendered ${render.table} in ${render.finish}.`;
      aiRenderResultEl.innerHTML = renderResultCard(render);
    } catch (error) {
      aiRenderStatusEl.textContent = error.message;
    } finally {
      setAiButtons(false);
    }
  });

  aiBatchRenderBtnEl.addEventListener("click", async () => {
    const table = tables.find((item) => item.slug === aiTableSelectEl.value);
    const apiKey = aiApiKeyEl.value.trim();
    setAiButtons(true);
    aiRenderResultEl.innerHTML = "";
    try {
      if (!apiKey) throw new Error("Paste your OpenAI API key first.");
      for (let index = 0; index < finishes.length; index++) {
        const finish = finishes[index];
        aiFinishSelectEl.value = finish.slug;
        aiRenderStatusEl.textContent = `Rendering ${table?.title || "table"}: ${finish.name} (${index + 1} of ${finishes.length}).`;
        const render = await renderAiImage(aiTableSelectEl.value, finish.slug, apiKey);
        aiRenderResultEl.insertAdjacentHTML("beforeend", renderResultCard(render));
      }
      aiRenderStatusEl.textContent = `Finished ${table?.title || "table"} in all ${finishes.length} finishes.`;
    } catch (error) {
      aiRenderStatusEl.textContent = error.message;
    } finally {
      setAiButtons(false);
    }
  });

  if (renderManifest?.finishes?.length) {
    finishRenderSelectEl.innerHTML = renderManifest.finishes
      .map((finish) => `<option value="${escapeHtml(finish.slug)}">${escapeHtml(finish.name)}</option>`)
      .join("");

    const renderFinish = () => {
      const finish = renderManifest.finishes.find((item) => item.slug === finishRenderSelectEl.value) || renderManifest.finishes[0];
      finishRendersEl.innerHTML = finish.tables
        .map(
          (table) => `
            <a class="review-cell render-card" href="${root}${table.file}" target="_blank" rel="noreferrer">
              <img src="${root}${table.file}" alt="${escapeHtml(table.title)} in ${escapeHtml(finish.name)}" loading="lazy">
              <span>${escapeHtml(table.title)}</span>
            </a>
          `
        )
        .join("");
    };

    finishRenderSelectEl.addEventListener("change", renderFinish);
    renderFinish();
  } else {
    finishRendersEl.innerHTML = `<p class="empty">No finish renders yet.</p>`;
  }

  tablesEl.innerHTML = tables
    .map(
      (table, index) => `
        <article class="finish-table">
          <div class="finish-table-head">
            <h3>${escapeHtml(table.title)}</h3>
            <a href="/cutout.html?table=${index}">Edit Cutout</a>
          </div>
          <div class="review-grid">
            <a class="review-cell" href="${root}${table.tableFile}" target="_blank" rel="noreferrer">
              <img src="${root}${table.tableFile}" alt="${escapeHtml(table.title)} original" loading="lazy">
              <span>Original</span>
            </a>
            <a class="review-cell" href="${root}${table.masks.preview}" target="_blank" rel="noreferrer">
              <img src="${root}${table.masks.preview}" alt="${escapeHtml(table.title)} mask preview" loading="lazy">
              <span>Mask Preview</span>
            </a>
            <a class="review-cell" href="${root}${table.masks.cloth}" target="_blank" rel="noreferrer">
              <img src="${root}${table.masks.cloth}" alt="${escapeHtml(table.title)} cloth mask" loading="lazy">
              <span>Cloth Mask</span>
            </a>
            <a class="review-cell" href="${root}${table.clothRemovedFile}" target="_blank" rel="noreferrer">
              <img class="transparent-preview" src="${root}${table.clothRemovedPreviewFile || table.clothRemovedFile}" alt="${escapeHtml(table.title)} cloth removed" loading="lazy">
              <span>Transparent PNG</span>
            </a>
          </div>
          <div class="render-strip">
            ${table.sampleRenders
              .map(
                (render) => `
                  <a class="review-cell" href="${root}${render.file}" target="_blank" rel="noreferrer">
                    <img src="${root}${render.file}" alt="${escapeHtml(table.title)} ${escapeHtml(render.finish)}" loading="lazy">
                    <span>${escapeHtml(render.finish)}</span>
                  </a>
                `
              )
              .join("")}
          </div>
        </article>
      `
    )
    .join("");
}

load().catch((error) => {
  tablesEl.innerHTML = `<p class="empty">${escapeHtml(error.message)}</p>`;
});
