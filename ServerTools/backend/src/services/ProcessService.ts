import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import BaseService from './BaseService';
import { ServerAlreadyRunningError, ServerNotRunningError } from '../errors/ServerError';

/**
 * Servico responsavel por gerenciar o processo do servidor de Minecraft.
 * Encapsula a logica de ChildProcess (spawn), gerenciamento de streams (stdout/stderr)
 * e maquinas de estado ("starting", "running", "stopping", "stopped").
 */
class ProcessService extends BaseService {
    /** Referencia para o processo filho do servidor Java/NeoForge */
    private _serverProcess: ChildProcess | null = null;
    
    /** Estado atual do servidor */
    private _serverStatus: string = "stopped";

    constructor() {
        super("ProcessService");
    }

    /**
     * @returns O estado atual da maquina de estados do servidor
     */
    getStatus(): string {
        return this._serverStatus;
    }

    /**
     * Inicia o servidor do Minecraft apontando para `startserver.bat`.
     * @throws {ServerAlreadyRunningError} Se o servidor ja estiver em execucao ou iniciando
     * @returns O novo estado ("starting")
     */
    startServer(): string {
        if (this._serverStatus !== "stopped") {
            throw new ServerAlreadyRunningError();
        }

        this.log("Iniciando servidor...");
        this._serverStatus = "starting";

        const serverDir = path.resolve(__dirname, "../../../../ServerFiles");
        const batPath = path.join(serverDir, "startserver.bat");

        this._serverProcess = spawn("cmd.exe", ["/c", batPath], { cwd: serverDir });

        // Listener de logs normais (stdout)
        this._serverProcess.stdout?.on("data", (data: Buffer) => {
            const output = data.toString();
            // Identifica que o servidor carregou por completo quando encontra a palavra "Done" (Vanilla) ou a string de ajuda
            if (output.includes('Done') || output.includes('For help, type "help"')) {
                this._serverStatus = "running";
                this.log("Servidor totalmente iniciado!");
            }
        });

        // Listener de avisos/erros (stderr)
        this._serverProcess.stderr?.on("data", (data: Buffer) => {
            this.log(`WARN/ERR: ${data.toString()}`);
        });

        // Listener de encerramento do processo
        this._serverProcess.on("close", (code: number | null) => {
            this.log(`Processo encerrado com codigo ${code}`);
            this._serverProcess = null;
            this._serverStatus = "stopped";
        });

        return this._serverStatus;
    }

    /**
     * Envia o comando `stop` para o console do servidor de Minecraft para um desligamento seguro.
     * @throws {ServerNotRunningError} Se o servidor nao estiver ligado
     * @returns O novo estado ("stopping")
     */
    stopServer(): string {
        if (!this._serverProcess || this._serverStatus === "stopped") {
            throw new ServerNotRunningError();
        }

        this.log("Enviando comando 'stop'...");
        this._serverProcess.stdin?.write("stop\n");
        this._serverStatus = "stopping";
        return this._serverStatus;
    }

    /**
     * Reinicia o servidor de forma assincrona aguardando o desligamento completo antes de ligar novamente.
     * Possui um timeout de seguranca de 30 segundos (Circuit Breaker) para evitar Memory Leaks.
     * @returns Uma Promise com o novo estado ("starting") apos o reinicio
     */
    async restartServer(): Promise<string> {
        if (this._serverProcess && this._serverStatus !== "stopped") {
            this.stopServer();
        }

        return new Promise((resolve, reject) => {
            let attempts = 0;
            const checkInterval = setInterval(() => {
                attempts++;
                if (this._serverStatus === "stopped") {
                    clearInterval(checkInterval);
                    resolve(this.startServer());
                }
                // Disjuntor de seguranca para impedir vazamento do setInterval
                if (attempts > 30) {
                    clearInterval(checkInterval);
                    reject(new Error("Timeout: Servidor demorou mais de 30s para desligar."));
                }
            }, 1000);
        });
    }
}
const processService = new ProcessService();
export default processService;

