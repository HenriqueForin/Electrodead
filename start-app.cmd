@echo off
title Electrodead
echo.
echo Iniciando sistema Electrodead em http://localhost:3000...
echo Esta janela precisa ficar aberta enquanto voce usa o sistema.
echo.
cd /d "%~dp0"
if exist "%~dp0.tools\node-v24.16.0-win-x64" set PATH=%~dp0.tools\node-v24.16.0-win-x64;%PATH%
set NODE_OPTIONS=--use-system-ca
if exist ".\bin\npm.cmd" (
  set NPM_CMD=.\bin\npm.cmd
) else (
  set NPM_CMD=npm
)
call %NPM_CMD% run build:frontend
if errorlevel 1 (
  pause
  exit /b 1
)
echo.
echo Abra no navegador:
echo http://localhost:3000
echo.
call %NPM_CMD% start
pause
