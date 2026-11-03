@echo off
chcp 65001 > nul
title MARKETPLACE UPB - Iniciar Todo

echo.
echo ========================================================
echo   INICIANDO SERVIDORES MARKETPLACE PRODUCTO COMERCIAL
echo ========================================================
echo.
echo 1. Iniciando CMS Wagtail (Django) en http://localhost:8000
start "MARKETPLACE CMS (Wagtail)" "%~dp0start-cms.bat"

timeout /t 2 /nobreak > nul

echo 2. Iniciando Frontend (Next.js) en http://localhost:3000
start "MARKETPLACE WEB (Next.js)" "%~dp0start-web.bat"

echo.
echo Servidores lanzados en ventanas separadas.
echo Puedes cerrar esta ventana.
echo ========================================================
timeout /t 5
