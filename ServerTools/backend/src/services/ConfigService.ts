import fs from 'fs';
import path from 'path';
import BaseService from './BaseService';
import { InvalidConfigError, ResourceNotFoundError } from '../errors/ServerError';
import ConfigResponse from '../dto/response/ConfigResponse';

/**
 * Servico responsavel por ler, parsear e escrever o arquivo `server.properties` do Minecraft.
 * Mantem a formatacao original e injeta ou altera as configuracoes on-the-fly de forma sincrona.
 */
class ConfigService extends BaseService {
    /** Caminho absoluto para o arquivo server.properties */
    private propsPath: string;

    constructor() {
        super("ConfigService");
        this.propsPath = path.resolve(__dirname, "../../../../ServerFiles/server.properties");
    }

    /**
     * @returns "Arquivo carregado" ou "Nao encontrado"
     */
    getStatus(): string {
        return fs.existsSync(this.propsPath) ? "Arquivo carregado" : "Nao encontrado";
    }

    /**
     * Le o arquivo de propriedades e transforma em um DTO fortemente tipado.
     * @throws {ResourceNotFoundError} Se o arquivo fisico nao existir na pasta ServerFiles
     * @returns O modelo de resposta contendo o dicionario chave-valor do properties
     */
    getConfig(): ConfigResponse {
        if (!fs.existsSync(this.propsPath)) {
            throw new ResourceNotFoundError("server.properties nao encontrado.");
        }
        const content = fs.readFileSync(this.propsPath, "utf-8");
        return new ConfigResponse(this.parseProperties(content));
    }

    /**
     * Valida e aplica um objeto de alteracoes no arquivo de propriedades fisico.
     * @param updates - Um dicionario (Record<string, string>) com as chaves a serem atualizadas
     * @throws {InvalidConfigError} Se o valor de uma chave controlada (ex: difficulty) for ilegal
     * @throws {ResourceNotFoundError} Se o arquivo fisico nao existir
     */
    saveConfig(updates: Record<string, string>): void {
        this.validate(updates);
        if (!fs.existsSync(this.propsPath)) {
            throw new ResourceNotFoundError("server.properties nao encontrado.");
        }
        
        let content = fs.readFileSync(this.propsPath, "utf-8");
        content = this.updateProperties(content, updates);
        fs.writeFileSync(this.propsPath, content, "utf-8");
        this.log("server.properties atualizado com sucesso!");
    }

    /**
     * Converte o texto plano (Properties-format) para um dicionario JavaScript,
     * ignorando comentarios e linhas em branco.
     * @param content - O texto cru do server.properties
     * @returns Dicionario mapeado
     */
    private parseProperties(content: string): Record<string, string> {
        const config: Record<string, string> = {};
        content.split("\n").forEach(line => {
            if (line.trim() && !line.startsWith("#")) {
                const parts = line.split("=");
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    const value = parts.slice(1).join("=").trim();
                    config[key] = value;
                }
            }
        });
        return config;
    }

    /**
     * Sobrescreve linhas pontuais mantendo os comentarios originais intactos.
     * @param content - O texto cru do server.properties
     * @param updates - Dicionario com as edicoes
     * @returns O novo texto formato plain string pronto para escrita
     */
    private updateProperties(content: string, updates: Record<string, string>): string {
        let lines = content.split("\n");
        for (const key in updates) {
            let found = false;
            lines = lines.map(line => {
                if (line.startsWith(key + "=")) {
                    found = true;
                    return `${key}=${updates[key]}`;
                }
                return line;
            });
            if (!found) lines.push(`${key}=${updates[key]}`);
        }
        return lines.join("\n");
    }

    /**
     * Regras de dominio para impedir injeções problematicas nos arquivos de config do Java.
     * @param updates - Dicionario de propriedades recebidas da API
     */
    private validate(updates: Record<string, string>): void {
        const VALID_VALUES: Record<string, string[]> = {
            difficulty: ["peaceful", "easy", "normal", "hard"],
            gamemode: ["survival", "creative", "adventure", "spectator"]
        };
        for (const key of Object.keys(updates)) {
            if (VALID_VALUES[key] && !VALID_VALUES[key].includes(updates[key])) {
                throw new InvalidConfigError(`Valor invalido para ${key}`);
            }
        }
    }
}
const configService = new ConfigService();
export default configService;

