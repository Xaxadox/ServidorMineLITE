// @ts-nocheck
import { test, describe, expect, beforeEach, jest } from '@jest/globals';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import ConfigService from '../services/ConfigService';

// Mocka o modulo fs para nao tocar em arquivos reais
jest.mock("fs");
import fs from 'fs';

describe("ConfigService", () => {
    describe("parseProperties()", () => {
        test("deve ignorar linhas comentadas com #", () => {
            const content = "#comentario\ndifficulty=hard\n";
            const result = ConfigService.parseProperties(content);
            expect(result.difficulty).toBe("hard");
            expect(result["#comentario"]).toBeUndefined();
        });

        test("deve ignorar linhas vazias", () => {
            const content = "\nmax-players=10\n\n";
            const result = ConfigService.parseProperties(content);
            expect(result["max-players"]).toBe("10");
            expect(Object.keys(result)).toHaveLength(1);
        });

        test("deve retornar objeto vazio para conteudo vazio", () => {
            const result = ConfigService.parseProperties("");
            expect(result).toEqual({});
        });

        test("deve suportar valores com = no conteudo (ex: URLs)", () => {
            const content = "resource-pack=https://github.com/a?b=1\n";
            const result = ConfigService.parseProperties(content);
            expect(result["resource-pack"]).toBe("https://github.com/a?b=1");
        });
    });

    describe("updateProperties()", () => {
        test("deve atualizar uma propriedade existente", () => {
            const content = "difficulty=normal\n";
            const result = ConfigService.updateProperties(content, { difficulty: "hard" });
            expect(result).toContain("difficulty=hard");
            expect(result).not.toContain("difficulty=normal");
        });

        test("deve adicionar propriedade nova se nao existir", () => {
            const content = "difficulty=normal\n";
            const result = ConfigService.updateProperties(content, { "nova-prop": "valor" });
            expect(result).toContain("nova-prop=valor");
        });
    });

    describe("validate()", () => {
        test("deve aceitar dificuldade valida", () => {
            expect(() => ConfigService.validate({ difficulty: "hard" })).not.toThrow();
        });

        test("deve rejeitar dificuldade invalida", () => {
            expect(() => ConfigService.validate({ difficulty: "impossivel" })).toThrow();
        });

        test("deve aceitar gamemode valido", () => {
            expect(() => ConfigService.validate({ gamemode: "creative" })).not.toThrow();
        });

        test("deve rejeitar gamemode invalido", () => {
            expect(() => ConfigService.validate({ gamemode: "godmode" })).toThrow();
        });
    });

    describe("getStatus()", () => {
        test("deve retornar Arquivo carregado quando o arquivo existe", () => {
            fs.existsSync.mockReturnValue(true);
            expect(ConfigService.getStatus()).toBe("Arquivo carregado");
        });

        test("deve retornar Nao encontrado quando o arquivo nao existe", () => {
            fs.existsSync.mockReturnValue(false);
            expect(ConfigService.getStatus()).toBe("Nao encontrado");
        });
    });
});




