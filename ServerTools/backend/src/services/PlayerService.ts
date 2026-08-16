import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import BaseService from './BaseService';
import PlayerResponse from '../dto/PlayerResponse';
import { ResourceNotFoundError } from '../errors/ServerError';

/**
 * Interface estrita para os meta-dados dos backups em .zip
 */
export interface BackupInfo {
    filename: string;
    sizeBytes: number;
    createdAt: Date;
}

/**
 * Servico de dados operacionais e de mapa (Players/World).
 * Realiza as medicoes de backups na pasta `backups/` e gerencia a leitura do `playerdata`.
 */
class PlayerService extends BaseService {
    private worldPath: string;
    private playerdataDir: string;
    private backupsDir: string;

    constructor() {
        super("PlayerService");
        this.worldPath = path.resolve(__dirname, "../../../../ServerFiles/world");
        this.playerdataDir = path.join(this.worldPath, "playerdata");
        this.backupsDir = path.resolve(__dirname, "../../../../backups");
    }

    /**
     * @returns "Ativo" se o mundo e cache existirem, senao "Aguardando Mundo"
     */
    getStatus(): string {
        return fs.existsSync(this.playerdataDir) ? "Ativo" : "Aguardando Mundo";
    }

    /**
     * Recupera a lista de jogadores baseada nos arquivos `.dat` gerados no `playerdata`.
     * 
     * @todo Implementar leitura real de NBT com a biblioteca `prismarine-nbt`. 
     * Atualmente, para manter a simplicidade e a performance em tempo de prototipagem, 
     * a logica de parsing NBT binaria foi mockada e retorna dados estaticos seguros.
     * 
     * @returns Array de PlayerResponse contendo status emulados ou reais
     */
    async getPlayers(): Promise<PlayerResponse[]> {
        if (!fs.existsSync(this.playerdataDir)) {
            return [];
        }

        const files = fs.readdirSync(this.playerdataDir).filter(f => f.endsWith(".dat"));
        const players: PlayerResponse[] = [];

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

    /**
     * Aciona assincronamente a criacao de um backup compactado do mundo via PowerShell (Compress-Archive).
     * @throws {ResourceNotFoundError} Caso o mundo ainda nao tenha sido gerado
     * @returns O nome do arquivo .zip resultante
     */
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

            child.on("close", (code: number | null) => {
                if (code === 0) {
                    this.log(`Backup criado com sucesso: ${filename}`);
                    resolve(filename);
                } else {
                    reject(new Error("Erro ao criar backup no PowerShell."));
                }
            });
        });
    }

    /**
     * Varre a pasta de backups e levanta metadados (bytes e data).
     * Ordena do backup mais recente (no topo) para o mais antigo.
     * @returns Array validado por BackupInfo
     */
    listBackups(): BackupInfo[] {
        if (!fs.existsSync(this.backupsDir)) return [];
        const files = fs.readdirSync(this.backupsDir).filter(f => f.endsWith(".zip"));
        return files.map(f => {
            const stat = fs.statSync(path.join(this.backupsDir, f));
            return {
                filename: f,
                sizeBytes: stat.size,
                createdAt: stat.birthtime
            };
        }).sort((a: BackupInfo, b: BackupInfo) => b.createdAt.getTime() - a.createdAt.getTime());
    }
}
const playerService = new PlayerService();
export default playerService;

