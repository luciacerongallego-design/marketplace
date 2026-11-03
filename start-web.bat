@echo off
chcp 65001 > nul
title MARKETPLACE UPB - Frontend (Next.js)
echo.
echo ========================================================
echo   PRODUCTO COMERCIAL - Frontend Next.js
echo ========================================================
echo.
echo  Sitio web:    http://localhost:3000
echo  Marcas:       http://localhost:3000/marcas
echo  Productos:    http://localhost:3000/productos
echo.
echo  Nota: Si el CMS no esta corriendo, se usan datos demo.
echo ========================================================
cd /d "%~dp0apps\web"
npm run dev
pause
