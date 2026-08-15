# AI Agent Project Context

You are working on a custom, lightweight Minecraft 1.21.1 NeoForge server ("ATM10 Lite") accompanied by a React/Node.js web dashboard (`ServerTools`).
This file contains the immutable rules and architectural decisions for this workspace. **You MUST adhere to these guidelines when suggesting changes.**

## 1. Project Directory Structure

- `ServerFiles/` - The dedicated Minecraft server (run `startserver.bat`). **DO NOT** put client-only mods here.
- `ServerTools/` - The Web Management Panel.
  - `backend/` - Node.js/Express backend (TypeScript strict mode, port 3002).
  - `frontend/` - React/Vite frontend (TypeScript, port 5173).
- `anexos/` - Distributable assets for players (Resource Packs, Modpacks for PolyMC).
- `backups/` - World backups generated via PowerShell scripts.

---

## 2. ServerTools Architecture (Web Dashboard)

The Web Dashboard is divided into a Node.js API and a React UI.

### 2.1 Backend Rules (Node.js / Express / TypeScript)
- The backend strictly follows **Object-Oriented Programming (OOP)**.
- **Class Hierarchy**: `ConfigService`, `ProcessService`, and `PlayerService` MUST extend the abstract `BaseService`.
- **Error Handling**: **NEVER** use `throw new Error('generic')`. Always throw a specific `ServerError` subclass (e.g., `ServerAlreadyRunningError`).
- **Routing**: **NEVER** place business logic inside `ServerController.ts`. It solely routes requests and catches errors using the `handleError()` middleware.
- **Testing**: ALL new service logic MUST be unit tested via Jest in `src/tests/`.

### 2.2 Frontend Rules (React / Vite / TypeScript)
- Components MUST be written as functional components using React Hooks (`useState`, `useEffect`).
- **Styling**: Uses standard CSS modules or global `.css` files.
- **Testing**: Components MUST be tested using Vitest and React Testing Library (`src/__tests__/`). State updates in tests MUST be wrapped in `act(...)`.

---

## 3. Minecraft Server Rules

### 3.1 Server-Side vs Client-Side Separation
**NEVER** add the following mods to `ServerFiles/mods/`. They are client-only and will instantly crash the dedicated server:
- `embeddium`, `neoculus`, `entityculling`
- `entity_model_features` (EMF), `entity_texture_features` (ETF)
- `xaerominimap`, `xaeroworldmap`

These mods belong EXCLUSIVELY in the `anexos/mods_clientes/` folder distributed to players.

### 3.2 Critical `server.properties` Configurations
- `online-mode=false` (To support offline PolyMC accounts).
- `allow-flight=true` (Prevents kicks from jetpacks and modded flying items).
- `max-tick-time=180000` (Prevents watchdog crashes during heavy mod loading).
- `view-distance=16` and `simulation-distance=8`.
- `difficulty=hard`.
- `resource-pack`: The server hosts a merged `.zip` of Fresh Animations and Dark Mode hosted on GitHub (`ATM_Lite_Pack.zip`).

---

## 4. Network Boundaries & Access

- **Minecraft Server (Port 25565)**: Exposed externally via Playit.gg. 
  - The `playitd` service runs automatically in the Windows background.
  - Public IP for players: `tissues-boston.tun.ply.gg`
- **Web Dashboard (Ports 3002 & 5173)**: Strictly **LOCAL**.
  - The dashboard is NOT tunneled. It is accessed securely on the host machine via `http://localhost:5173`.

---

## 5. Startup Instructions

If you need to start the environments to verify behavior:
1. **Minecraft Server**: Execute `F:\ServidorMineLITE\ServerFiles\startserver.bat`. Wait for "Done!" in the console.
2. **Web Dashboard**: Execute `F:\ServidorMineLITE\ServerTools\INICIAR_PAINEL.bat`. This script automatically boots both the backend and frontend simultaneously.

---

## 6. Known Troubleshooting

- **`Failed to parse resource pack prompt` in logs**: Normal bug in MC 1.21.1 because `resource-pack-prompt` is raw text instead of JSON. Ignore it.
- **Server crash during startup**: Check if `max-tick-time` is reached or if a client-side mod was accidentally dropped in the `mods/` folder.
- **JEI incompatible with Sophisticated Backpacks**: Requires JEI `>= 19.32`. Use `jei-1.21.1-neoforge-19.44.0.401.jar` or higher.
