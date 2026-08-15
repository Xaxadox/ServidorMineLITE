import express from 'express';
const router = express.Router();
import processService from '../services/ProcessService';
import configService from '../services/ConfigService';
import playerService from '../services/PlayerService';
import StatusResponse from '../dto/response/StatusResponse';
import ConfigResponse from '../dto/response/ConfigResponse';
import { ServerError } from '../errors/ServerError';

/**
 * Middleware centralizador de erros de dominio.
 * Converte ServerError (e subclasses) em respostas HTTP apropriadas.
 */
import { Response } from 'express';
const handleError = (err: any, res: Response) => {
    if (err instanceof ServerError) {
        return res.status(err.statusCode).json({ error: err.message, type: err.name });
    }
    return res.status(500).json({ error: err.message });
};

// --- STATUS ---
router.get("/status", (req: any, res: Response) => {
    const status = processService.getStatus();
    res.json(new StatusResponse(status));
});

// --- CONTROLE DO PROCESSO ---
router.post("/start", async (req: any, res: Response) => {
    try {
        const status = processService.startServer();
        res.json(new StatusResponse(status, "Servidor iniciando..."));
    } catch (err) {
        handleError(err, res);
    }
});

router.post("/stop", (req: any, res: Response) => {
    try {
        const status = processService.stopServer();
        res.json(new StatusResponse(status, "Servidor parando..."));
    } catch (err) {
        handleError(err, res);
    }
});

router.post("/restart", async (req: any, res: Response) => {
    try {
        const status = await processService.restartServer();
        res.json(new StatusResponse(status, "Reiniciando..."));
    } catch (err) {
        handleError(err, res);
    }
});

// --- CONFIGURACOES ---
router.get("/config", (req: any, res: Response) => {
    try {
        const config = configService.getConfig();
        res.json(config);
    } catch (err) {
        handleError(err, res);
    }
});

router.post("/config", (req: any, res: Response) => {
    try {
        configService.saveConfig(req.body);
        res.json({ success: true });
    } catch (err) {
        handleError(err, res);
    }
});

// --- JOGADORES ---
router.get("/players", async (req: any, res: Response) => {
    try {
        const players = await playerService.getPlayers();
        res.json(players);
    } catch (err) {
        handleError(err, res);
    }
});

// --- BACKUP [US05 - Sprint 2] ---
router.post("/backup", async (req: any, res: Response) => {
    try {
        const result = await playerService.createBackup();
        res.json({ success: true, backup: result });
    } catch (err) {
        handleError(err, res);
    }
});

router.get("/backups", (req: any, res: Response) => {
    try {
        const backups = playerService.listBackups();
        res.json(backups);
    } catch (err) {
        handleError(err, res);
    }
});

export default router;


