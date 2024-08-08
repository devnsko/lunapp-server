export default class ApiError extends Error {
    status: number;
    errors: string[];

    constructor(status: number, message: string, errors: string[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Unauthorized');
    }

    static BadRequestError(message: string, errors: string[] = []) {
        return new ApiError(400, 'Bad Request', errors);
    }
}