# Pool Table Image Project Handoff

Date: May 23, 2026

## What This Project Does

This is a local app for collecting pool table images, cutting out the cloth bed, and rendering wood finish variations for the website.

Local app URL:

```text
http://localhost:4174/
```

Main review page:

```text
http://localhost:4174/finish.html
```

Waypoint cloth cutout tool:

```text
http://localhost:4174/cutout.html
```

## Current Status

Imported product images:

```text
California House: 14 tables
Olhausen: 40 tables total
Canada Billiard: 52 tables
Total imported: 106 tables
```

California House finish swatches:

```text
16 finishes
```

California House cloth cutouts:

```text
14 approved transparent PNG cutouts
```

AI wood finish renders completed:

```text
Atherton Pool Table: 16 finishes complete
Austin Pool Table: 16 finishes complete
Total AI renders complete: 32
```

## Important Folders

All vendor original/normalized image exports:

```text
exports/all-vendors
```

California House approved cloth-removed PNGs:

```text
exports/california-house-cloth-removed
```

California House AI render exports:

```text
exports/california-house-ai-renders
```

California House working files:

```text
finish-workbench/california-house
```

California House finish swatches:

```text
finish-workbench/california-house/finish-swatches
```

Manual waypoint cutout data:

```text
finish-workbench/california-house/manual-cutouts
finish-workbench/california-house/table-workbench.json
```

AI render manifest:

```text
finish-workbench/california-house/ai-renders/manifest.json
```

## How To Run It On This Computer

Double-click:

```text
start.cmd
```

Or run:

```text
start.ps1
```

Then open:

```text
http://localhost:4174/finish.html
```

The app uses the bundled Codex Node runtime at:

```text
%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node
```

If that runtime is missing on a different computer, reopen this project in Codex first so the runtime/dependencies are available.

## How To Continue Rendering

1. Open `http://localhost:4174/finish.html`.
2. Scroll to `AI Render Test`.
3. Pick a table.
4. Paste the OpenAI API key into the key box.
5. Click `Render Table All Finishes`.
6. Leave the browser/app running until the batch finishes.

The key is used for the local render request and is not saved into this project.

Output saves to:

```text
exports/california-house-ai-renders/<finish-name>/
```

The app also updates:

```text
finish-workbench/california-house/ai-renders/manifest.json
```

## Cost And Time Notes

Observed cost:

```text
One table x 16 finishes: about $0.83
California House, all 14 tables: about $11.62 total
All 106 imported tables, assuming 16 finishes each: about $87.98
```

Observed speed estimate:

```text
One table x 16 finishes: roughly 16-32 minutes
California House, all 14 tables: roughly 4-8 hours
All 106 imported tables: roughly 28-56 hours
```

The app currently renders one image at a time. This is slower but safer for API limits and failed renders.

## What We Tried And Rejected

We tried automatic pixel recoloring using masks and finish swatches. It technically changed color, but it did not look like real rendered wood and sometimes affected shadows/background. We decided to stop using that as the final method.

Those old test outputs are still in:

```text
exports/california-house-finish-renders
finish-workbench/california-house/finish-renders
```

Use the AI renders instead.

## Best Current Workflow

For each vendor:

1. Collect clean table images.
2. Use waypoint tool to remove the cloth area.
3. Approve cloth cutout PNGs.
4. AI-render table through each wood finish.
5. Reapply the saved cloth cutout after render.
6. Website fills the transparent cloth bed area with selected cloth hex color.

## Remaining Work

California House:

```text
12 tables still need AI finish batches if only Atherton and Austin are complete.
```

Other vendors:

```text
Olhausen and Canada Billiard still need cloth cutouts and finish render setup.
```

One vendor has images already in every finish/cloth combination. That vendor should be handled last because it may be easier to scrape existing finish images and then cut out the cloth.

## Key App Files

Server/API:

```text
server.js
```

Image importer UI:

```text
public/index.html
public/app.js
public/styles.css
```

Finish/render UI:

```text
public/finish.html
public/finish.js
public/finish.css
```

Waypoint cutout UI:

```text
public/cutout.html
public/cutout.js
public/cutout.css
```

California House prep/generation tools:

```text
tools/california-house-finish-prep.js
tools/california-house-render-finishes.js
```

## Security Note

No OpenAI API key is intentionally saved in this project. If a key was pasted into the app, it was sent to the local server for that render request only.
