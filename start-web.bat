@echo off
chcp 65001 > nul
title MARKETPLACE UPB - Frontend (Next.js)

:: Asegurar que Node.js y npm esten en PATH aunque Explorer no haya recargado variables
set "PATH=C:\Program Files\nodejs;%APPDATA%\npm;%PATH%"

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
echo.

cd /d "%~dp0apps\web"

where npm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] No se encontro npm o Node.js en el sistema.
    echo Por favor verifica que Node.js este instalado en C:\Program Files\nodejs
    pause
    exit /b 1
)

echo Iniciando servidor de desarrollo de Next.js en el puerto 3000...
echo.
call npm run dev
pause
