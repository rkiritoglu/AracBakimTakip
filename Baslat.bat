@echo off
cd /d "%~dp0"
title OtoBakim Pro - Arac Bakim Takip Sistemi
echo ===================================================
echo   OtoBakim Pro Baslatiliyor...
echo ===================================================
echo.
ping 127.0.0.1 -n 3 >nul
start http://localhost:5173
call npm.cmd run dev
pause
