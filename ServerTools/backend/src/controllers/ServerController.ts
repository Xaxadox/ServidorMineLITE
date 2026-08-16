import express, { Request, Response } from 'express';
const router = express.Router();
import processService from '../services/ProcessService';
import configService from '../services/ConfigService';
import playerService from '../services/PlayerService';
import playitService from '../services/PlayitService';
import StatusResponse from '../dto/response/StatusResponse';
import { ServerError } from '../errors/ServerError';

/**
 * Controller principal da API de gerenciamento do Minecraft.
 * Centraliza o roteamento HTTP, tratamento de erros e injecao de dependencias dos Services.
 */

/**
 * Middleware de interceptacao padronizada de excecoes.
 * Assegura que falhas nao capturadas retornem payload JSON solido (500 ou Codigo de Dominio).
 * @param err Objeto de erro capturado
 * @param res Response HTTP do Express
 */
const handleError = (err: unknown, res: Response) => {
    if (err instanceof ServerError) {
        return res.status(err.statusCode).json({ error: err.message, type: err.name });
    }
    if (err instanceof Error) {
        return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: "Erro interno desconhecido." });
};

// --- STATUS ---

/**
 * [GET] /api/status
 * Retorna o estado instantaneo do processo do Minecraft.
 */
router.get("/status", (req: Request, res: Response) => {
    const status = processService.getStatus();
    res.json(new StatusResponse(status));
});

// --- CONTROLE DO PROCESSO ---

/**
 * [POST] /api/start
 * Tenta inicializar o servidor. Dispara erro 409 se ja estiver em andamento.
 */
router.post("/start", async (req: Request, res: Response) => {
    try {
        const status = processService.startServer();
        res.json(new StatusResponse(status, "Servidor iniciando..."));
    } catch (err) {
        handleError(err, res);
    }
});

/**
 * [POST] /api/stop
 * Injeta "stop" no stdin do Minecraft para desligar a JVM de modo limpo.
 */
router.post("/stop", (req: Request, res: Response) => {
    try {
        const status = processService.stopServer();
        res.json(new StatusResponse(status, "Servidor parando..."));
    } catch (err) {
        handleError(err, res);
    }
});

/**
 * [POST] /api/restart
 * Reinicio assincrono (circuit breaker habilitado).
 */
router.post("/restart", async (req: Request, res: Response) => {
    try {
        const status = await processService.restartServer();
        res.json(new StatusResponse(status, "Reiniciando..."));
    } catch (err) {
        handleError(err, res);
    }
});

// --- CONFIGURACOES ---

/**
 * [GET] /api/config
 * Baixa as propriedades completas de server.properties em formato de dicionario.
 */
router.get("/config", (req: Request, res: Response) => {
    try {
        const config = configService.getConfig();
        res.json(config);
    } catch (err) {
        handleError(err, res);
    }
});

/**
 * [POST] /api/config
 * Atualiza sob demanda chaves do properties (com validacao de schema nativo).
 */
router.post("/config", (req: Request, res: Response) => {
    try {
        configService.saveConfig(req.body);
        res.json({ success: true });
    } catch (err) {
        handleError(err, res);
    }
});

// --- JOGADORES ---

/**
 * [GET] /api/players
 * Transforma dados do `.dat` NBT em um JSON tipado para exibicao na tabela.
 */
router.get("/players", async (req: Request, res: Response) => {
    try {
        const players = await playerService.getPlayers();
        res.json(players);
    } catch (err) {
        handleError(err, res);
    }
});

/**
 * [POST] /api/players/action
 * Executa comandos nativos no console para gerenciar jogadores (Estilo Aternos).
 */
router.post("/players/action", (req: Request, res: Response) => {
    try {
        const { playerName, action } = req.body;
        if (!playerName || !action) {
            return res.status(400).json({ error: "playerName e action sao obrigatorios." });
        }

        let cmd = "";
        switch (action) {
            case "heal":
                cmd = `effect give ${playerName} instant_health 1 255`;
                break;
            case "feed":
                cmd = `effect give ${playerName} saturation 1 255`;
                break;
            case "starve":
                cmd = `effect give ${playerName} hunger 30 255`;
                break;
            case "kill":
                cmd = `kill ${playerName}`;
                break;
            case "clear":
                cmd = `clear ${playerName}`;
                break;
            default:
                return res.status(400).json({ error: "Acao invalida." });
        }

        processService.sendCommand(cmd);
        res.json({ success: true, message: `Acao '${action}' executada para ${playerName}.` });
    } catch (err) {
        handleError(err, res);
    }
});

// --- BACKUP [US05 - Sprint 2] ---

/**
 * [POST] /api/backup
 * Engatilha comando pesado (Compress-Archive) via PowerShell.
 */
router.post("/backup", async (req: Request, res: Response) => {
    try {
        const result = await playerService.createBackup();
        res.json({ success: true, backup: result });
    } catch (err) {
        handleError(err, res);
    }
});

/**
 * [GET] /api/backups
 * Lista historico e bytes em disco.
 */
router.get("/backups", (req: Request, res: Response) => {
    try {
        const backups = playerService.listBackups();
        res.json(backups);
    } catch (err) {
        handleError(err, res);
    }
});

/**
 * [GET] /api/playit/status
 * Retorna o status do tunel global Playit.gg
 */
router.get("/playit/status", async (req: Request, res: Response) => {
    try {
        const status = await playitService.checkTunnel();
        res.json(status);
    } catch (err) {
        handleError(err, res);
    }
});

export default router;



