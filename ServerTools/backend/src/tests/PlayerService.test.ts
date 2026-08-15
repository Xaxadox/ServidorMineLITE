// @ts-nocheck
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import PlayerResponse from '../dto/PlayerResponse';
import { ResourceNotFoundError } from '../errors/ServerError';
import path from 'path';

jest.mock("fs");
jest.mock("child_process", () => ({
    spawn: jest.fn(() => ({
        stdout: { on: jest.fn() },
        stderr: { on: jest.fn() },
        on: jest.fn((event, cb) => {
            if (event === "close") (cb as any)(0);
        })
    }))
}));

describe("PlayerService & PlayerResponse DTO", () => {
    let svc: any;

    beforeEach(() => {
        jest.resetModules();
        svc = require("../services/PlayerService");
    });

    describe("PlayerResponse DTO", () => {
        it("deve mapear dados NBT brutos corretamente", () => {
            const rawData = {
                name: "Notch",
                uuid: "123",
                health: 19.5,
                pos: [10.123, 64, -5.999],
                dimension: "minecraft:the_nether",
                playerGameType: 1
            };
            
            const dto = new PlayerResponse(rawData);
            expect(dto.name).toBe("Notch");
            expect(dto.health).toBe(20);
            expect(dto.position.x).toBe("10.12");
            expect(dto.position.y).toBe("64.00");
            expect(dto.position.z).toBe("-6.00");
            expect(dto.dimension).toBe("minecraft:the_nether");
            expect(dto.gameMode).toBe("creative");
        });
        
        it("deve lidar com jogador faltando NBT", () => {
            const dto = new PlayerResponse({ name: "Herobrine" });
            expect(dto.gameMode).toBe("survival");
            expect(dto.position.y).toBe(0);
        });
    });
});



