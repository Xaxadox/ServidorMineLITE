export class ServerError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ServerAlreadyRunningError extends ServerError {
    constructor() { super("O servidor ja esta rodando.", 409); }
}

export class ServerNotRunningError extends ServerError {
    constructor() { super("O servidor nao esta rodando.", 409); }
}

export class ResourceNotFoundError extends ServerError {
    constructor(message: string = "Recurso nao encontrado.") { super(message, 404); }
}

export class InvalidConfigError extends ServerError {
    constructor(message: string = "Configuracao invalida.") { super(message, 400); }
}
