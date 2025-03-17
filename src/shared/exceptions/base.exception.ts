export class BaseException extends Error {
    public readonly statusCode: number;
    public readonly errorType: string;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;

        Object.setPrototypeOf(this, BaseException.prototype);
    }
}
