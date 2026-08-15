/**
 * DTO envolucro de configuracao que restringe properties dinamicos ao formato de strings.
 */
export default class ConfigResponse {
    /** Dicionario em memoria contendo os atributos exatos do `server.properties` */
    config: Record<string, string>;
    
    constructor(configData: Record<string, string>) {
        this.config = configData;
    }
}
