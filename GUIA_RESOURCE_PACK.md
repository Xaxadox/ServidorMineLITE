# GUIA: Como hospedar e ativar o Resource Pack no servidor ATM Lite

## Por que e necessario hospedar?
O Minecraft precisa de uma URL **publica e de download direto** para enviar o resource pack
automaticamente para os jogadores quando entram. Nao funciona com arquivos locais.

---

## PASSO 1: Montar o Resource Pack combinado

Voce precisa combinar os 3 packs em um unico arquivo .zip.
A ordem de prioridade (de baixo para cima) deve ser:

```
[3] Fresh Animations    <- aplica por cima de tudo
[2] Default Dark Mode   <- aplica por cima do Vanilla Tweaks
[1] Vanilla Tweaks      <- base
```

### Como combinar:
1. Baixe os 3 packs (serao arquivos .zip)
2. Crie uma pasta chamada "ATMLite-Pack"
3. Copie o conteudo do Vanilla Tweaks primeiro
4. Copie o conteudo do Default Dark Mode por cima (substitua os conflitantes)
5. Copie o conteudo do Fresh Animations por cima (substitua os conflitantes)
6. Compacte a pasta "ATMLite-Pack" como .zip
7. O arquivo pack.mcmeta DEVE estar na raiz do .zip (nao dentro de uma subpasta!)

---

## PASSO 2: Hospedar o arquivo .zip

### Opcao A: GitHub Releases (Recomendada - GRATIS)
1. Crie uma conta em https://github.com
2. Crie um repositorio publico chamado "atm-lite-pack"
3. Va em "Releases" > "Create a new release"
4. Coloque qualquer tag (ex: "v1.0")
5. Arraste o seu .zip para a secao "Attach binaries"
6. Publique o release
7. Clique com o botao direito no arquivo .zip e copie o link direto
   (sera algo como: https://github.com/SEU_USUARIO/atm-lite-pack/releases/download/v1.0/ATMLite-Pack.zip)

### Opcao B: Dropbox (Gratis e facil)
1. Suba o .zip para o Dropbox
2. Clique em "Compartilhar" > "Copiar link"
3. O link sera: https://www.dropbox.com/s/XXXX/arquivo.zip?dl=0
4. Mude o "?dl=0" para "?dl=1" para virar link direto de download

### Opcao C: Google Drive (Gratis mas mais complicado)
- Nao recomendado: o Google Drive nao fornece links de download direto
  de forma confiavel para o Minecraft.

---

## PASSO 3: Gerar o Hash SHA-1 do arquivo

O hash garante que o jogo nao baixe o pack toda vez que o jogador entrar.

### No Windows (PowerShell):
```powershell
Get-FileHash "C:\caminho\para\ATMLite-Pack.zip" -Algorithm SHA1
```

Copie o valor que aparecer (sera algo como: a3f8c1d2e4b5...)

---

## PASSO 4: Atualizar o server.properties

Abra o arquivo:
  F:\ServidorMineLITE\ServerFiles\server.properties

Substitua as linhas:
  resource-pack=COLE_A_URL_DO_SEU_ZIP_AQUI
  resource-pack-sha1=COLE_O_HASH_SHA1_DO_ZIP_AQUI

Por:
  resource-pack=https://github.com/SEU_USUARIO/atm-lite-pack/releases/download/v1.0/ATMLite-Pack.zip
  resource-pack-sha1=a3f8c1d2e4b5... (o hash que voce gerou)

---

## PASSO 5: Configurar o Fresh Animations no modo "Low"

Para garantir que todos joguem no modo leve (recomendado):
1. Entre no servidor com o resource pack ativo
2. Va em Opcoes > Pacotes de Recursos
3. Clique na engrenagem ao lado do "Fresh Animations"
4. Escolha a opcao "Low" (Baixo)

O modo "Low" do Fresh Animations ainda e muito superior ao Vanilla:
- Mobs se movem naturalmente
- Animacoes de andar, correr e atacar sao fluidas
- Gasta ~40% menos FPS que o modo "Full"

---

## RESUMO DE O QUE CADA JOGADOR PRECISA

### Na pasta .minecraft\mods\ (so no PC deles, nao no servidor):
- Entity Model Features (EMF)
- Entity Texture Features (ETF)
- Embeddium
- Entity Culling
- FerriteCore

### Na pasta .minecraft\resourcepacks\ (automatico pelo servidor!):
- O servidor envia automaticamente o ATMLite-Pack.zip quando entram
- Eles apenas precisam aceitar o prompt na tela

---

Qualquer duvida, consulte o README.md principal do ServidorMineLITE.
