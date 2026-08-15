@echo off
set NEOFORGE_VERSION=21.1.241
set "LITE_JAVA=C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot\bin\java.exe"
:: Para desativar reinicializacao automatica, defina LITE_RESTART como false

set INSTALLER="%~dp0neoforge-%NEOFORGE_VERSION%-installer.jar"
set NEOFORGE_URL="https://maven.neoforged.net/releases/net/neoforged/neoforge/%NEOFORGE_VERSION%/neoforge-%NEOFORGE_VERSION%-installer.jar"

:JAVA
if not defined LITE_JAVA (
    set LITE_JAVA=java
)

"%LITE_JAVA%" -version 1>nul 2>nul || (
   echo Minecraft 1.21 requer Java 21 - Java nao encontrado!
   pause
   exit /b 1
)

:NEOFORGE
setlocal
cd /D "%~dp0"
if not exist "libraries" (
    echo NeoForge nao instalado. Instalando agora...
    if not exist %INSTALLER% (
        echo Baixando NeoForge...
        bitsadmin.exe /rawreturn /nowrap /transfer neoforge /download /priority FOREGROUND %NEOFORGE_URL% %INSTALLER%
    )
    "%LITE_JAVA%" -jar %INSTALLER% -installServer
)

if not exist "server.properties" (
    (
        echo allow-flight=true
        echo motd=ATM Lite - Servidor Leve e Divertido!
        echo max-tick-time=180000
        echo simulation-distance=6
        echo view-distance=10
    )> "server.properties"
)

:START
echo.
echo ============================================
echo    ATM Lite Server - Iniciando...
echo ============================================
echo.
"%LITE_JAVA%" @user_jvm_args.txt @libraries\net\neoforged\neoforge\%NEOFORGE_VERSION%\win_args.txt nogui

if "%LITE_RESTART%" == "false" ( goto:EOF )

echo Reiniciando em 10 segundos... (Ctrl+C para cancelar)
timeout /t 10 /nobreak > NUL
goto:START
