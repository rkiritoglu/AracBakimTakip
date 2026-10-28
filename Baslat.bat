@echo off
title OtoBakim Pro - Arac Bakim Takip Sistemi
echo ===================================================
echo   OtoBakim Pro Baslatiliyor...
echo ===================================================
echo.
timeout /t 2 /nobreak >nul
start http://localhost:5173
call npm run dev
pause
