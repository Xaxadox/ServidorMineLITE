@echo off
echo ============================================
echo   ATM Lite - Gerador de Hash SHA-1
echo ============================================
echo.
echo Arraste o arquivo .zip do resource pack e pressione Enter:
set /p "ZIPFILE=Caminho do arquivo: "

if not exist "%ZIPFILE%" (
    echo ERRO: Arquivo nao encontrado!
    pause
    exit /b
)

echo.
echo Calculando SHA-1...
powershell -Command "$h=(Get-FileHash '%ZIPFILE%' -Algorithm SHA1).Hash.ToLower(); Write-Host '; Write-Host 'SHA-1: ' $h; Write-Host '; Write-Host 'Cole no server.properties:'; Write-Host 'resource-pack-sha1=' $h"
echo.
pause