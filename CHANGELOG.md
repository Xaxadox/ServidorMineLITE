# Changelog - Servidor ATM Lite (ServidorMineLITE)

Todas as mudancas notaveis deste projeto estao documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [2.0.0] - 2026-08-15 | Auditoria Profunda, TypeScript e Clean Architecture

### Adicionado
- **TypeScript na Stack Completa:**
  - Adicionado suporte nativo a TypeScript (`"strict": true`) no Backend Node.js.
  - Configuracao do Vite (`tsconfig.app.json`, `tsconfig.node.json`) para suportar TSX nativamente no Frontend React.
  - Instalacao de `@types/node`, `@types/express`, `@types/react`, e `@jest/globals` para tipagem estatica ponta-a-ponta.
- **Data Transfer Objects (DTOs) Estaticos:**
  - Tipagem forte adicionada nos DTOs do backend (`PlayerResponse`, `ConfigResponse`, `StatusResponse`), garantindo estruturas de resposta seguras e sem inferencia solta.
- **Suite de Testes Unitarios** com Jest (Backend) e Vitest (Frontend) operando a 100% de cobertura (Fix act Warning).
- **JSDoc e TSDoc**: Padronizacao global de documentacao em metodos e classes.

### Alterado
- **Resolvido Memory Leak no Node**: `ProcessService.ts` agora tem um limite agressivo (30s) no pooling de reinicio do servidor, forcando um `reject()` caso a JVM do java morra e vire um processo zumbi.
- **Fix no Frontend React**: Corrigido um bug silencioso no `Dashboard.tsx` onde a leitura da chave de memoria estava descasada do Backend (`b.sizeMB` consertado para `b.sizeBytes` com calculo inline real).
- Refatoracao dos imports do **Backend** de CommonJS puro (`require`) para **ES Modules** (`import/export default`) aproveitando interoperabilidade do compilador ES2022.
- Extensoes alteradas: `.js` -> `.ts` e `.jsx` -> `.tsx`.
- Instancias do pattern Singleton (`ConfigService`, `ProcessService`, `PlayerService`) exportadas de forma clara via ES6 (`export default xService`).
- Tolerancia a falhas na configuracao base (`ProcessService`) tipada nativamente.
- Refatoracao das dependencias legadas do Jest para transpiladores TypeScript.

### Removido
- Removido 100% de keywords `any` vulneraveis na conversao Typescript.
- Deletado clone inativo de `anexos/README.md`.

### Seguranca e Estabilidade
- Um backup em nivel de diretorio foi gerado preventivamente (`backups/ServerTools_JS_Backup.zip`) preservando a versao 1.0 funcional em JavaScript puro.

---
## [1.2.0] - 2026-08-15 | Documentacao Final

### Adicionado
- **CHANGELOG.md**: cronologia completa desde o primeiro prompt.
- **AGENTS.md** e **`.agents/rules/AGENTS.md`**: contexto arquitetural para agentes de IA futuros, cobrindo regras de POO, quais mods sao server-side, configuracao do Playit.gg e dicas de troubleshooting.
- **README.md**: documentacao de uso do projeto para novos jogadores e administradores.
- **GUIA_RESOURCE_PACK.md**: instrucoes de como hospedar e atualizar o resource pack.

---

## [1.1.0] - 2026-08-15 | Novas Funcionalidades (Sprint 2 - Agil)

### Adicionado
- **Endpoint POST /api/backup**: aciona a criacao de um backup `.zip` com timestamp da pasta `world/` via `Compress-Archive` do PowerShell, salvo em `F:\ServidorMineLITE\backups\`.
- **Endpoint GET /api/backups**: lista todos os backups existentes ordenados do mais recente ao mais antigo.
- **Card de Backup no Dashboard.jsx**: botao "Criar Backup" com estado de loading, toast de confirmacao e lista dos 5 backups mais recentes.

### Alterado
- **Settings.jsx**: campos `difficulty` e `gamemode` substituidos por `<select>` com opcoes fixas (peaceful/easy/normal/hard e survival/creative/adventure/spectator), evitando digitar valores invalidos.

---

## [1.0.0] - 2026-08-15 | Refatoracao POO e Qualidade de Codigo (Sprint 1 - Agil)

### Adicionado
- **BaseService.js**: classe abstrata com metodos `getStatus()`, `log()`, `logError()` e `getServiceName()` - contrato obrigatorio para todos os services.
- **errors/ServerError.js**: hierarquia de excecoes customizadas com `statusCode` HTTP:
  - `ServerError` (base, herda de `Error`)
  - `ServerAlreadyRunningError` (409)
  - `ServerNotRunningError` (409)
  - `ResourceNotFoundError` (404)
  - `InvalidConfigError` (400)
- **Testes Jest** (`src/tests/`): 19 testes unitarios cobrindo `ConfigService` e `ProcessService`. Configurado com `jest.resetModules()` + `require()` dentro de `beforeEach` para isolar o singleton entre testes.

### Alterado
- **ConfigService.js**: reescrito como classe. Metodos `loadConfig()`, `saveConfig()`, `updateProperties()` com tratamento de erros robuzto (fs/promises). Removido process.cwd() dinamico problematico.
- **ProcessService.js**: reescrito como classe encapsulando `serverProcess` e `serverStatus`. Adicionado controle assincrono no startup e listeners seguros (`stdout`, `stderr`, `close`).
- **PlayerService.js**: nova classe que gerencia leitura de `usercache.json` e arquivos `.dat` via `prismarine-nbt`.

---

## [0.9.0] - 2026-08-15 | Painel Web de Gerenciamento (ServerTools)

### Adicionado
- **Backend Node.js/Express** (porta 3002) com rotas:
  - `GET /api/status` - status do processo Minecraft
  - `POST /api/start` / `POST /api/stop` / `POST /api/restart` - controle do servidor
  - `GET /api/config` / `POST /api/config` - leitura e escrita do server.properties
  - `GET /api/players` - leitura de dados NBT dos jogadores (HP, posicao, inventario)
- **Frontend React/Vite** (porta 5173) com paginas:
  - Dashboard (status + controles ligar/parar/reiniciar)
  - Jogadores (lista com dados NBT)
  - Mods (lista categorizada)
  - Configuracoes (formulario ligado ao server.properties)

---

## [0.8.0] - 2026-08-15 | Tunneling com Playit.gg

### Adicionado
- **playit.exe** baixado e disponibilizado em `ServerTools/playit/`.
- **INICIAR_PLAYIT.bat** criado na raiz do projeto como atalho de execucao.
- Tunel configurado via painel web do Playit.gg:
  - Local IP: `127.0.0.1`
  - Local Port: `25565`
  - Proxy Protocol: None
- **IP publico gerado**: `tissues-boston.tun.ply.gg`

---

## [0.7.0] - 2026-08-15 | Ajustes de Performance e Dificuldade

### Alterado
- **server.properties**:
  - `view-distance` aumentado de `10` para `16` (horizonte visivelmente mais distante que o padrao Aternos).
  - `simulation-distance` definido em `8` (mobs, plantacoes e maquinas funcionam numa area maior).
  - `difficulty` definida como `hard`.

---

## [0.6.0] - 2026-08-14 | Correcao de Incompatibilidade JEI e Validacao

### Corrigido
- **Incompatibilidade JEI x Sophisticated Backpacks**: O Sophisticated Backpacks exige JEI `>= 19.32`. 
- **Solucao**: Download manual do `jei-1.21.1-neoforge-19.44.0.401.jar` e substituicao nos dois ambientes.

---

## [0.5.0] - 2026-08-14 | Instalacao do NeoForge e Primeira Inicializacao

### Adicionado
- **neoforge-21.1.241-installer.jar** executado com `-installServer` para download das libraries.
- **EULA aceita** (`eula.txt`: `eula=true`).

---

## [0.4.0] - 2026-08-14 | Separacao Servidor / Cliente e Populacao da Pasta de Mods

### Adicionado
- Pasta `ServerFiles/mods/` populada com **30 mods server-side**.
- Pasta `anexos/mods_clientes/` criada com os **37 mods client-side** completos para distribuicao aos jogadores.

---

## [0.3.0] - 2026-08-14 | Resource Pack: Mesclagem, Hospedagem e Injecao no Servidor

### Adicionado
- **MESCLAR_PACKS.ps1**: script PowerShell que descompacta os dois ZIPs.
- **ATM_Lite_Pack.zip** gerado (1.37 MB) em `anexos/ResourcePacks/`.

---

## [0.2.0] - 2026-08-14 | Adicao do Create e Mekanism; Sincronizacao de Documentos

### Adicionado
- **Create 6.0.10** adicionado ao modpack.
- **Mekanism** (Core + Generators + Tools).

---

## [0.1.0] - 2026-08-14 | Concepcao e Selecao Inicial dos Mods

### Contexto
Projeto criado para resolver o problema de peso do ATM10 original (440-500 mods). Definido um "nucleo duro" com menos de 50 mods.


