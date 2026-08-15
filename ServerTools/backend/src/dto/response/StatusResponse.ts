export default class StatusResponse {
    status: string;
    message?: string;
    constructor(status: string, message?: string) {
        this.status = status;
        if (message) this.message = message;
    }
}
