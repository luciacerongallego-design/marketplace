@echo off
chcp 65001 > nul
title MARKETPLACE UPB - CMS (Wagtail)

:: Asegurar que Python este en PATH
set "PATH=C:\Users\luceg\AppData\Local\Programs\Python\Python312;C:\Users\luceg\AppData\Local\Programs\Python\Python312\Scripts;%PATH%"

echo.
echo ========================================================
echo   PRODUCTO COMERCIAL - CMS Wagtail
echo ========================================================
echo.
echo  Panel admin:  http://localhost:8000/admin/
echo  API:          http://localhost:8000/api/v2/pages/
echo.
echo  Usuario: admin   Contrasena: admin1234
echo.
echo ========================================================
echo.

cd /d "%~dp0apps\cms"

if not exist ".venv\Scripts\python.exe" (
    echo [ERROR] No se encontro el entorno virtual en apps\cms\.venv
    pause
    exit /b 1
)

echo Iniciando servidor Django/Wagtail en http://127.0.0.1:8000...
echo.
call ".venv\Scripts\python.exe" manage.py runserver 127.0.0.1:8000
pause
