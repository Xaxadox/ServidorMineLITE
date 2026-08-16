import { exec } from 'child_process';
import util from 'util';
import BaseService from './BaseService';

const execAsync = util.promisify(exec);

/**
 * Servico para interrogar o Daemon do Playit.gg que roda no Windows.
 */
class PlayitService extends BaseService {
    private readonly staticIp = "tissues-boston.tun.ply.gg";

    constructor() {
        super("PlayitService");
    }

    getStatus(): string {
        return "online"; // Dummy para satisfazer contrato do BaseService
    }

    /**
     * Verifica na lista de tarefas do Windows se o Daemon do playit esta rodando.
     */
    async checkTunnel(): Promise<{ status: string, ip: string }> {
        try {
            const { stdout } = await execAsync('tasklist /FI "IMAGENAME eq playitd*" /FO CSV /NH');
            if (stdout.includes("playitd")) {
                return { status: "online", ip: this.staticIp };
            }
            return { status: "offline", ip: "Tunel Desligado" };
        } catch (error) {
            this.logError(String(error));
            return { status: "offline", ip: "Erro de Consulta" };
        }
    }
}

const playitService = new PlayitService();
export default playitService;

