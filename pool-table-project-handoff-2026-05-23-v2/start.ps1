$ErrorActionPreference = "Stop"

$runtimeRoot = "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\node"
$node = Join-Path $runtimeRoot "bin\node.exe"
$modules = Join-Path $runtimeRoot "node_modules"
$pnpm = Join-Path $modules ".pnpm"

if (!(Test-Path $node)) {
  Write-Host "Could not find the bundled Node runtime at $node"
  exit 1
}

$extraModulePaths = @($modules)
if (Test-Path $pnpm) {
  $extraModulePaths += Get-ChildItem $pnpm -Directory | ForEach-Object { Join-Path $_.FullName "node_modules" }
}

$env:NODE_PATH = ($extraModulePaths -join [IO.Path]::PathSeparator)
& $node .\server.js
