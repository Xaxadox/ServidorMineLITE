import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import BaseService from './BaseService';

class ProcessService extends BaseService {
    private _serverProcess: ChildProcess | null = null;
    private _serverStatus: string = "stopped";

    constructor() {
        super("ProcessService");
    }

    getStatus(): string {
        return this._serverStatus;
    }

    startServer(): string {
        if (this._serverStatus !== "stopped") {
            const { ServerAlreadyRunningError } = require("../errors/ServerError");
            throw new ServerAlreadyRunningError();
        }

        this.log("Iniciando servidor...");
        this._serverStatus = "starting";

        const serverDir = path.resolve(__dirname, "../../../ServerFiles");
        const batPath = path.join(serverDir, "startserver.bat");

        this._serverProcess = spawn("cmd.exe", ["/c", batPath], { cwd: serverDir });

        this._serverProcess.stdout?.on("data", (data: any) => {
            const output = data.toString();
            if (output.includes('Done') || output.includes('For help, type "help"')) {
                this._serverStatus = "running";
                this.log("Servidor totalmente iniciado!");
            }
        });

        this._serverProcess.stderr?.on("data", (data: any) => {
            this.log(`WARN/ERR: ${data.toString()}`);
        });

        this._serverProcess.on("close", (code: any) => {
            this.log(`Processo encerrado com codigo ${code}`);
            this._serverProcess = null;
            this._serverStatus = "stopped";
        });

        return this._serverStatus;
    }

    stopServer(): string {
        if (!this._serverProcess || this._serverStatus === "stopped") {
            const { ServerNotRunningError } = require("../errors/ServerError");
            throw new ServerNotRunningError();
        }

        this.log("Enviando comando 'stop'...");
        this._serverProcess.stdin?.write("stop\n");
        this._serverStatus = "stopping";
        return this._serverStatus;
    }

    async restartServer(): Promise<string> {
        if (this._serverProcess && this._serverStatus !== "stopped") {
            this.stopServer();
        }

        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (this._serverStatus === "stopped") {
                    clearInterval(checkInterval);
                    resolve(this.startServer());
                }
            }, 1000);
        });
    }
}
const processService = new ProcessService();
export default processService;


