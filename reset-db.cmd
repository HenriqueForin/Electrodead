@echo off
title Reset Banco Electrodead
cd /d "%~dp0"
if exist ".\bin\npm.cmd" (
  set NPM_CMD=.\bin\npm.cmd
) else (
  set NPM_CMD=npm
)
echo.
echo ATENCAO: isto vai apagar o banco local do projeto Electrodead.
echo Use apenas se voce ainda nao precisa preservar dados cadastrados.
echo.
set /p CONFIRMAR=Digite APAGAR para continuar: 
if /I not "%CONFIRMAR%"=="APAGAR" (
  echo Operacao cancelada.
  pause
  exit /b 0
)

echo.
echo Parando e removendo container antigo...
docker stop electrodead-postgres 2>nul
docker rm electrodead-postgres 2>nul

echo.
echo Removendo volumes antigos do projeto...
for /f "tokens=*" %%v in ('docker volume ls --format "{{.Name}}" ^| findstr /i "projeto_electrodead_postgres_data Projeto_Electrodead_postgres_data electrodead_postgres_data postgres_data"') do (
  docker volume rm %%v 2>nul
)

echo.
echo Subindo PostgreSQL novamente com usuario postgres e senha postgres...
docker compose up -d
if errorlevel 1 (
  docker-compose up -d
)

echo.
echo Aguardando banco iniciar...
timeout /t 8 /nobreak >nul

echo.
echo Banco do projeto configurado em localhost:55432.

echo.
echo Rodando migracoes e criando usuario admin...
call %NPM_CMD% run db:migrate
if errorlevel 1 (
  pause
  exit /b 1
)

call %NPM_CMD% run admin:create
if errorlevel 1 (
  pause
  exit /b 1
)

echo.
echo Banco pronto.
echo Login: admin
echo Senha: 123456
echo.
pause
