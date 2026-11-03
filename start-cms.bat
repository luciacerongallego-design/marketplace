@echo off
chcp 65001 > nul
title MARKETPLACE UPB - CMS (Wagtail)
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
cd /d "%~dp0apps\cms"
call .venv\Scripts\activate.bat
python manage.py runserver 8000
pause
