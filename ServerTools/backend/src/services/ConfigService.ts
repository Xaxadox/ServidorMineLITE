import fs from 'fs';
import path from 'path';
import BaseService from './BaseService';
import { InvalidConfigError, ResourceNotFoundError } from '../errors/ServerError';
import ConfigResponse from '../dto/response/ConfigResponse';

class ConfigService extends BaseService {
    private propsPath: string;

    constructor() {
        super("ConfigService");
        this.propsPath = path.resolve(__dirname, "../../../ServerFiles/server.properties");
    }

    getStatus(): string {
        return fs.existsSync(this.propsPath) ? "Arquivo carregado" : "Nao encontrado";
    }

    getConfig(): any {
        if (!fs.existsSync(this.propsPath)) {
            throw new ResourceNotFoundError("server.properties nao encontrado.");
        }
        const content = fs.readFileSync(this.propsPath, "utf-8");
        return new ConfigResponse(this.parseProperties(content));
    }

    saveConfig(updates: any): void {
        this.validate(updates);
        if (!fs.existsSync(this.propsPath)) {
            throw new ResourceNotFoundError("server.properties nao encontrado.");
        }
        
        let content = fs.readFileSync(this.propsPath, "utf-8");
        content = this.updateProperties(content, updates);
        fs.writeFileSync(this.propsPath, content, "utf-8");
        this.log("server.properties atualizado com sucesso!");
    }

    private parseProperties(content: string): any {
        const config: any = {};
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

    private updateProperties(content: string, updates: any): string {
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

    private validate(updates: any): void {
        const VALID_VALUES: any = {
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


