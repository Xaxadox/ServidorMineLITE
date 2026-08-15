// @ts-nocheck
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
jest.mock("child_process", () => ({
    spawn: jest.fn(() => ({
        stdout: { on: jest.fn() },
        stderr: { on: jest.fn() },
        stdin: { write: jest.fn() },
        on: jest.fn(),
        once: jest.fn(),
    })),
}));

describe("ProcessService", () => {
    let svc: any;

    beforeEach(() => {
        jest.resetModules();
        // Importa DENTRO do beforeEach para pegar instancia nova a cada teste
        svc = require("../services/ProcessService").default;
    });

    describe("getStatus()", () => {
        it("deve retornar stopped no estado inicial", () => {
            expect(svc.getStatus()).toBe("stopped");
        });
    });

    describe("startServer()", () => {
        it("deve mudar status para starting", () => {
            svc.startServer();
            expect(svc.getStatus()).toBe("starting");
        });

        it("deve lancar erro na segunda chamada (servidor ja iniciado)", () => {
            svc.startServer();
            expect(() => svc.startServer()).toThrow("ja esta rodando");
        });
    });

    describe("stopServer()", () => {
        it("deve lancar erro se servidor nao estiver rodando", () => {
            expect(() => svc.stopServer()).toThrow("nao esta rodando");
        });
    });

    describe("heranca de BaseService", () => {
        it("getServiceName() deve retornar ProcessService", () => {
            expect(svc.getServiceName()).toBe("ProcessService");
        });

        it("deve ter metodo log() herdado da BaseService", () => {
            expect(typeof svc.log).toBe("function");
        });

        it("deve ter metodo logError() herdado da BaseService", () => {
            expect(typeof svc.logError).toBe("function");
        });
    });
});




