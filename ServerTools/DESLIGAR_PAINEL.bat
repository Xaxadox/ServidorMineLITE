@echo off
title Desligar ATM Lite
echo ============================================
echo    Desligando o ServerTools...
echo ============================================
echo.

for /f "tokens=5" %%a in ('netstat -aon ^| find ":3002" ^| find "LISTENING"') do taskkill /f /pid %%a > nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5174" ^| find "LISTENING"') do taskkill /f /pid %%a > nul 2>&1

echo Painel e processos encerrados com sucesso!
timeout /t 3 > nul
