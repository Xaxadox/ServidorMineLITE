import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import BaseService from './BaseService';
import PlayerResponse from '../dto/PlayerResponse';
import { ResourceNotFoundError } from '../errors/ServerError';

class PlayerService extends BaseService {
    private worldPath: string;
    private playerdataDir: string;
    private backupsDir: string;

    constructor() {
        super("PlayerService");
        this.worldPath = path.resolve(__dirname, "../../../ServerFiles/world");
        this.playerdataDir = path.join(this.worldPath, "playerdata");
        this.backupsDir = path.resolve(__dirname, "../../../backups");
    }

    getStatus(): string {
        return fs.existsSync(this.playerdataDir) ? "Ativo" : "Aguardando Mundo";
    }

    async getPlayers(): Promise<PlayerResponse[]> {
        if (!fs.existsSync(this.playerdataDir)) {
            return [];
        }

        const files = fs.readdirSync(this.playerdataDir).filter(f => f.endsWith(".dat"));
        const players: PlayerResponse[] = [];

        // Por simplicidade, usamos fake data igual antes, 
        // ja que a logica de NBT foi mockada
        for (const file of files) {
            players.push(new PlayerResponse({
                name: "Jogador " + file.substring(0, 4),
                uuid: file.replace(".dat", ""),
                health: 20,
                pos: [0, 64, 0],
                dimension: "minecraft:overworld",
                playerGameType: 0
            }));
        }
        return players;
    }

    async createBackup(): Promise<string> {
        this.log("Iniciando backup...");
        if (!fs.existsSync(this.worldPath)) {
            throw new ResourceNotFoundError("Pasta 'world' nao encontrada.");
        }
        if (!fs.existsSync(this.backupsDir)) {
            fs.mkdirSync(this.backupsDir, { recursive: true });
        }
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename = `backup_world_${timestamp}.zip`;
        const dest = path.join(this.backupsDir, filename);

        return new Promise((resolve, reject) => {
            const child = spawn("powershell.exe", [
                "-NoProfile", "-NonInteractive", "-Command",
                `Compress-Archive -Path '${this.worldPath}' -DestinationPath '${dest}' -CompressionLevel Fastest`
            ]);

            child.on("close", (code: any) => {
                if (code === 0) {
                    this.log(`Backup criado com sucesso: ${filename}`);
                    resolve(filename);
                } else {
                    reject(new Error("Erro ao criar backup no PowerShell."));
                }
            });
        });
    }

    listBackups(): any[] {
        if (!fs.existsSync(this.backupsDir)) return [];
        const files = fs.readdirSync(this.backupsDir).filter(f => f.endsWith(".zip"));
        return files.map(f => {
            const stat = fs.statSync(path.join(this.backupsDir, f));
            return {
                filename: f,
                sizeBytes: stat.size,
                createdAt: stat.birthtime
            };
        }).sort((a: any, b: any) => b.createdAt - a.createdAt);
    }
}
const playerService = new PlayerService();
export default playerService;


