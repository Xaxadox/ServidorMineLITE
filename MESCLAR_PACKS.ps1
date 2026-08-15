# Script de mesclagem de Resource Packs - ATM Lite

$packDir   = "F:\ServidorMineLITE\anexos\ResourcePacks"
$tempDir   = "F:\ServidorMineLITE\anexos\ResourcePacks\_temp_merge"
$outputZip = "F:\ServidorMineLITE\anexos\ResourcePacks\ATM_Lite_Pack.zip"

$freshAnim = Get-ChildItem "$packDir\Fresh*.zip" | Select-Object -First 1
$darkMode  = Get-ChildItem "$packDir\Default-Dark*.zip" | Select-Object -First 1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Mesclagem de Resource Packs - ATM Lite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pack 1: $($freshAnim.Name)" -ForegroundColor Green
Write-Host "Pack 2: $($darkMode.Name)" -ForegroundColor Green
Write-Host ""

if (Test-Path $tempDir)   { Remove-Item $tempDir -Recurse -Force }
if (Test-Path $outputZip) { Remove-Item $outputZip -Force }

New-Item -ItemType Directory -Path "$tempDir\fresh"  | Out-Null
New-Item -ItemType Directory -Path "$tempDir\dark"   | Out-Null
New-Item -ItemType Directory -Path "$tempDir\merged" | Out-Null

Write-Host "Extraindo Fresh Animations..." -ForegroundColor Yellow
Expand-Archive -Path $freshAnim.FullName -DestinationPath "$tempDir\fresh" -Force

Write-Host "Extraindo Default Dark Mode..." -ForegroundColor Yellow
Expand-Archive -Path $darkMode.FullName  -DestinationPath "$tempDir\dark"  -Force

Write-Host "Copiando Fresh Animations como base..." -ForegroundColor Yellow
Copy-Item "$tempDir\fresh\*" "$tempDir\merged\" -Recurse -Force

Write-Host "Mesclando Default Dark Mode..." -ForegroundColor Yellow
Copy-Item "$tempDir\dark\*" "$tempDir\merged\" -Recurse -Force

Write-Host "Gerando pack.mcmeta unificado..." -ForegroundColor Yellow
$packMeta = '{"pack":{"pack_format":34,"description":"ATM Lite Pack - Fresh Animations + Default Dark Mode"}}'
[System.IO.File]::WriteAllText("$tempDir\merged\pack.mcmeta", $packMeta)

Write-Host "Compactando pack final..." -ForegroundColor Yellow
Compress-Archive -Path "$tempDir\merged\*" -DestinationPath $outputZip -Force

Write-Host "Gerando Hash SHA-1..." -ForegroundColor Yellow
$hash = (Get-FileHash $outputZip -Algorithm SHA1).Hash.ToLower()

Remove-Item $tempDir -Recurse -Force

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Pack criado com sucesso!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Arquivo: $outputZip" -ForegroundColor White
Write-Host "Tamanho: $([math]::Round((Get-Item $outputZip).Length / 1MB, 2)) MB" -ForegroundColor White
Write-Host ""
Write-Host "SHA-1 para o server.properties:" -ForegroundColor Cyan
Write-Host $hash -ForegroundColor Yellow
Write-Host ""
Write-Host "Agora hospede o ATM_Lite_Pack.zip e cole a URL e o hash no server.properties!" -ForegroundColor Gray
Write-Host ""
Read-Host "Pressione Enter para fechar"