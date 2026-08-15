export default abstract class BaseService {
    protected name: string;
    
    constructor(name: string) {
        this.name = name;
    }

    log(message: any) {
        console.log(`[${this.name}] ${message}`);
    }

    abstract getStatus(): string;
}
