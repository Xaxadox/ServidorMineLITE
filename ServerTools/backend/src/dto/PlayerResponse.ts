export default class PlayerResponse {
    name: string;
    uuid: string;
    health: number;
    position: { x: string | number, y: string | number, z: string | number };
    dimension: string;
    gameMode: string;

    constructor(playerData: any) {
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
        this.gameMode = this._parseGameMode(playerData.playerGameType);
    }

    private _parseGameMode(type: any): string {
        const modes: any = {
            0: "survival",
            1: "creative",
            2: "adventure",
            3: "spectator"
        };
        return modes[type] || "survival";
    }
}
