/**
 * Classe base abstrata para todos os servicos do backend.
 * Fornece metodos padronizados de log e define o contrato obrigatorio para verificacao de status.
 */
export default abstract class BaseService {
    /** Nome identificador do servico para os logs */
    protected name: string;
    
    /**
     * @param name - O nome do servico (ex: "ProcessService")
     */
    constructor(name: string) {
        this.name = name;
    }

    /**
     * Emite um log de informacao padronizado no console.
     * @param message - A mensagem a ser logada
     */
    log(message: string): void {
        console.log(`[${this.name}] ${message}`);
    }

    /**
     * Emite um log de erro padronizado no console.
     * @param message - A mensagem de erro a ser logada
     */
    logError(message: string): void {
        console.error(`[${this.name}] ERROR: ${message}`);
    }

    /**
     * Retorna o nome do servico.
     * @returns O nome configurado no construtor
     */
    getServiceName(): string {
        return this.name;
    }

    /**
     * Contrato obrigatorio: Todo servico deve ser capaz de reportar seu status atual.
     * @returns Uma string indicando o estado (ex: "running", "Ativo", "Nao encontrado")
     */
    abstract getStatus(): string;
}
