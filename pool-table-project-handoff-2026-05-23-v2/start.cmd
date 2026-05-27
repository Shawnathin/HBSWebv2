@echo off
setlocal
set "RUNTIME=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node"
set "NODE=%RUNTIME%\bin\node.exe"

if not exist "%NODE%" (
  echo Could not find the bundled Node runtime at %NODE%
  exit /b 1
)

"%NODE%" "%~dp0server.js"
