# ATM Lite & ServerTools 🚀

Um projeto focado em resolver os problemas extremos de otimizacao e vazamento de memoria da serie oficial *All The Mods*. O **ATM Lite** reduz os ~450 mods originais para um **nucleo duro de ~35 mods essenciais**, cortando a exigencia de memoria RAM em 90%. 

Junto do Modpack, o projeto embarca o **ServerTools**, um painel de administracao Web Fullstack (TypeScript, React, Node.js) construido com Clean Architecture para facilitar a vida do host.

---

## 💻 Para Desenvolvedores (ServerTools)

O `ServerTools` e o painel de administracao local do servidor. Ele escuta e manipula arquivos .bat, NBT data (`world/playerdata`) e emite rotinas via PowerShell no Windows.

### Tech Stack
- **Frontend:** React, Vite, TypeScript estrito, Vanilla CSS.
- **Backend:** Node.js, Express, TypeScript, ChildProcess (JVM handler).

### Setup e Execucao
1. Navegue ate a pasta `ServerTools`.
2. Instale as dependencias simultaneas:
   ```bash
   npm run dev:install
   ```
3. Inicie o ambiente de desenvolvimento (Frontend no :5173, Backend no :3002):
   ```bash
   npm run dev
   ```

*(O Backend realiza polling e Circuit Breaker para prevencao de Memory Leaks do Java).*

---

# 🎮 Tutorial: Como entrar no servidor ATM Lite

Fala galera! Este e o servidor **ATM Lite** - uma versao enxuta e otimizada, sem travar o PC de ninguem!

**Voce NAO precisa ter o Minecraft original para entrar. O servidor aceita qualquer launcher!**

## Passo 1: Instalar o Java 21 (Obrigatorio)
O Minecraft 1.21 exige o Java 21. Se nao tiver, baixe e instale pelo link oficial:
https://adoptium.net/temurin/releases/?version=21

## Passo 2: Escolher e Instalar um Launcher

### Se voce TEM o Minecraft original (conta Mojang/Microsoft):
Use o **Launcher Oficial** normalmente. Ele ja suporta NeoForge.

### Se voce NAO tem o Minecraft original:
Recomendamos o **PollyMC**! Eu ja deixei o instalador dele na pasta `anexos`.
Basta dar dois cliques nele para instalar e usar. Ele e super leve, seguro e sem anuncios.
Ao abrir o PollyMC, escolha a opcao de **"Conta Offline"** ou **"Jogar Offline"** e coloque o seu nick.

## Passo 3: Criar a Instancia e Instalar o NeoForge

### No PollyMC:
1. Clique em **"Adicionar Instancia"**.
2. Escolha a versao **1.21.1** do Minecraft.
3. Na mesma tela, selecione o modloader **NeoForge** na versao **21.1.241**.
4. De um nome para ela (ex: "ATM Lite") e clique em OK.

### No Launcher Oficial ou TLauncher:
1. Dentro da pasta `anexos`, tem um arquivo chamado `neoforge-21.1.241-installer.jar`.
2. Deem dois cliques nele (vai abrir com o Java 21).
3. Deixem marcado **"Install client"** e cliquem OK.

## Passo 4: Colar os Mods no seu Jogo
A pasta `mods` que eu enviei ja contem TUDO necessario (conteudo, performance e visual). 
Voce so precisa coloca-la no lugar certo:

### Se estiver usando o PollyMC:
1. Clique com o botao direito na instancia "ATM Lite" que voce criou.
2. Selecione **"Pasta do Minecraft"** (ou "Minecraft Folder").
3. Cole a pasta `mods` (que esta junto com este tutorial) la dentro.

### Se estiver usando o Launcher Oficial ou TLauncher:
1. Aperte **Windows + R**, digite `%appdata%` e de Enter.
2. Abra a pasta `.minecraft`.
3. Cole a pasta `mods` la dentro.

*(Se ja existir uma pasta `mods` antiga, apague ela antes de colar a nova! Nunca misture com os mods do ATM10 original!)*

## Passo 5: Aceitar o Visual do Servidor (Resource Pack)
Quando entrar no servidor pela primeira vez, vai aparecer uma mensagem perguntando se quer baixar o visual do servidor. **ACEITE!** O servidor envia automaticamente os packs de textura. Se voce recusar, sera desconectado automaticamente.
Se perguntar sobre qualidade, escolha **"Low"** para melhor desempenho.

## Passo 6: Entrar no Servidor!
1. Abra o seu launcher e clique em Jogar na instancia/versao do NeoForge.
2. Depois que o jogo abrir, va em **Multiplayer > Adicionar Servidor**.
3. Em Endereco do Servidor, coloquem o IP local/Ngrok.
4. Entrem e divirtam-se!
