// CUSTOM API ERROR OBJECT
export class ApiError extends Error {
    fieldErrors?: Record<string, string>;
    status?: number;

    constructor(
        message: string,
        opts?: { fieldErrors?: Record<string, string>; status?: number }
    ) {
        super(message);
        this.name = "ApiError";
        this.fieldErrors = opts?.fieldErrors;
        this.status = opts?.status;
    }
}
