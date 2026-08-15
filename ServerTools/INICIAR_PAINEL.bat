@echo off
echo ============================================
echo    ATM Lite - ServerTools
echo ============================================
echo.
echo Iniciando o Backend (API) na porta 3002...
start "ATMLite - Backend" cmd /k "cd backend && npm start"

echo Iniciando a Interface Grafica (Frontend) na porta 5174...
start "ATMLite - Frontend" cmd /k "cd frontend && npm run dev -- --port 5174"

echo.
echo Tudo iniciado! Acesse: http://localhost:5174
echo (Porta diferente do ATM10 para nao conflitar!)
timeout /t 3 > nul
