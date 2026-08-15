export interface RawPlayerData {
    name?: string;
    uuid?: string;
    health?: number;
    pos?: (number | string)[];
    dimension?: string;
    playerGameType?: number;
}

/**
 * DTO que padroniza os dados binarios do NBT do jogador em JSON tipado.
 */
export default class PlayerResponse {
    /** Nickname formatado */
    name: string;
    
    /** UUID do cache */
    uuid: string;
    
    /** Pontos de vida arredondados (Max 20.0) */
    health: number;
    
    /** Coordenadas estruturadas de X Y Z formatadas (.toFixed) */
    position: { x: string | number, y: string | number, z: string | number };
    
    /** Dimensao extraida do NBT (ex: minecraft:overworld) */
    dimension: string;
    
    /** Modo de jogo legivel em string (0 = survival) */
    gameMode: string;

    /**
     * Parseia os dados sujos do `.dat` para um objeto limpo e seguro
     * @param playerData Interface do dado cru levantado pelo disco
     */
    constructor(playerData: RawPlayerData) {
        this.name = playerData.name || "Desconhecido";
        this.uuid = playerData.uuid || "";
        this.health = playerData.health ? Math.ceil(playerData.health) : 20;
        
        if (playerData.pos && Array.isArray(playerData.pos)) {
            this.position = {
                x: Number(playerData.pos[0]).toFixed(2),
                y: Number(playerData.pos[1]).toFixed(2),
                z: Number(playerData.pos[2]).toFixed(2)
            };
        } else {
            this.position = { x: 0, y: 0, z: 0 };
        }
        
        this.dimension = playerData.dimension || "minecraft:overworld";
        this.gameMode = this._parseGameMode(playerData.playerGameType ?? 0);
    }

    /**
     * Traduz inteiros NBT GameType em strings legiveis pelo Dashboard React.
     * @param type Codigo numerico do modo de jogo
     */
    private _parseGameMode(type: number): string {
        const modes: Record<number, string> = {
            0: "survival",
            1: "creative",
            2: "adventure",
            3: "spectator"
        };
        return modes[type] || "survival";
    }
}
