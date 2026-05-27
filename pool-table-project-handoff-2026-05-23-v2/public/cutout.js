const root = "/finish-workbench/california-house/";
const canvas = document.querySelector("#cutoutCanvas");
const ctx = canvas.getContext("2d");
const tableNameEl = document.querySelector("#tableName");
const progressTextEl = document.querySelector("#progressText");
const pointCountEl = document.querySelector("#pointCount");
const saveStatusEl = document.querySelector("#saveStatus");
const savedPreviewEl = document.querySelector("#savedPreview");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const undoBtn = document.querySelector("#undoBtn");
const clearBtn = document.querySelector("#clearBtn");
const saveBtn = document.querySelector("#saveBtn");
const saveNextBtn = document.querySelector("#saveNextBtn");

let tables = [];
let currentIndex = 0;
let points = [];
let image = new Image();

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getIndexFromUrl() {
  const params = new URLSearchParams(location.search);
  return Math.max(0, Number(params.get("table")) || 0);
}

function setIndexInUrl(index) {
  const next = new URL(location.href);
  next.searchParams.set("table", String(index));
  history.replaceState(null, "", next);
}

function draw() {
  if (!image.complete || !image.naturalWidth) return;
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);

  if (points.length) {
    ctx.beginPath();
    points.forEach((point, index) => {
      const x = point.x * canvas.width;
      const y = point.y * canvas.height;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    if (points.length > 2) ctx.closePath();
    ctx.fillStyle = "rgba(0, 170, 84, 0.25)";
    ctx.strokeStyle = "#00a854";
    ctx.lineWidth = 5;
    ctx.fill();
    ctx.stroke();
  }

  points.forEach((point, index) => {
    const x = point.x * canvas.width;
    const y = point.y * canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#007a3d";
    ctx.stroke();
    ctx.fillStyle = "#0d1b1e";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(index + 1), x, y + 1);
  });

  pointCountEl.textContent = points.length;
  undoBtn.disabled = points.length === 0;
  clearBtn.disabled = points.length === 0;
  saveBtn.disabled = points.length < 3;
  saveNextBtn.disabled = points.length < 3;
}

function loadCurrentTable() {
  const table = tables[currentIndex];
  if (!table) return;
  setIndexInUrl(currentIndex);
  points = table.manualCutout?.points ? table.manualCutout.points.map((point) => ({ x: point.x, y: point.y })) : [];
  tableNameEl.textContent = table.title;
  progressTextEl.textContent = `${currentIndex + 1} of ${tables.length}`;
  saveStatusEl.textContent = points.length ? "Saved points loaded. Adjust or save again." : "Click the cloth edge to place points.";
  savedPreviewEl.style.display = table.clothRemovedPreviewFile ? "block" : "none";
  if (table.clothRemovedPreviewFile) savedPreviewEl.src = `${root}${table.clothRemovedPreviewFile}?v=${Date.now()}`;
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === tables.length - 1;
  image = new Image();
  image.onload = draw;
  image.src = `${root}${table.tableFile}?v=${Date.now()}`;
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  const clientX = event.touches?.[0]?.clientX ?? event.clientX;
  const clientY = event.touches?.[0]?.clientY ?? event.clientY;
  return {
    x: clamp((clientX - rect.left) / rect.width, 0, 1),
    y: clamp((clientY - rect.top) / rect.height, 0, 1)
  };
}

async function refreshTables() {
  tables = await fetch(`${root}table-workbench.json?v=${Date.now()}`).then((response) => response.json());
}

async function saveCutout(goNext = false) {
  const table = tables[currentIndex];
  if (!table || points.length < 3) return;
  saveStatusEl.textContent = "Saving transparent PNG...";
  saveBtn.disabled = true;
  saveNextBtn.disabled = true;

  const response = await fetch("/api/cloth-cutout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ slug: table.slug, points })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Could not save the cutout.");

  await refreshTables();
  saveStatusEl.textContent = "Saved. Transparent PNG updated.";
  savedPreviewEl.style.display = "block";
  savedPreviewEl.src = `${result.files.checkerPreview}?v=${Date.now()}`;
  if (goNext && currentIndex < tables.length - 1) {
    currentIndex += 1;
    loadCurrentTable();
  } else {
    loadCurrentTable();
  }
}

canvas.addEventListener("click", (event) => {
  points.push(canvasPoint(event));
  saveStatusEl.textContent = "Waypoint added.";
  draw();
});

canvas.addEventListener(
  "touchstart",
  (event) => {
    event.preventDefault();
    points.push(canvasPoint(event));
    saveStatusEl.textContent = "Waypoint added.";
    draw();
  },
  { passive: false }
);

prevBtn.addEventListener("click", () => {
  currentIndex = Math.max(0, currentIndex - 1);
  loadCurrentTable();
});

nextBtn.addEventListener("click", () => {
  currentIndex = Math.min(tables.length - 1, currentIndex + 1);
  loadCurrentTable();
});

undoBtn.addEventListener("click", () => {
  points.pop();
  saveStatusEl.textContent = "Last waypoint removed.";
  draw();
});

clearBtn.addEventListener("click", () => {
  points = [];
  saveStatusEl.textContent = "Waypoints cleared.";
  draw();
});

saveBtn.addEventListener("click", () => saveCutout(false).catch((error) => {
  saveStatusEl.textContent = error.message;
  draw();
}));

saveNextBtn.addEventListener("click", () => saveCutout(true).catch((error) => {
  saveStatusEl.textContent = error.message;
  draw();
}));

refreshTables()
  .then(() => {
    currentIndex = clamp(getIndexFromUrl(), 0, Math.max(0, tables.length - 1));
    loadCurrentTable();
  })
  .catch((error) => {
    saveStatusEl.textContent = error.message;
  });
