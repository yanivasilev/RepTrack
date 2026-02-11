import { ApiError } from "./apiError";

// CONVERTING AXIOS ERRORS TO API ERRORS
// IT HELPS BY STOPPING THE REPEAT OF TRY AND CATCH
export function normaliseApiError(err: unknown, fallback = "Request failed"): never {
    const anyErr = err as any;
    const status: number | undefined = anyErr?.response?.status;
    const json = anyErr?.response?.data;

    // IF BACKEND SEND ZOD ERRORS:
    if (json?.errors?.length) {
        const fieldErrors: Record<string, string> = {};

        for (const e of json.errors) {
            if (e?.field && !fieldErrors[e.field]) {
                fieldErrors[e.field] = e.message ?? "Invalid";
            }
        }

        throw new ApiError("Validation failed", { fieldErrors, status });
    }

    // OTHERWISE US THE MESSAGE FROM THE BACKEND
    const message =
        json?.message ??
        anyErr?.message ??
        (status ? `${fallback} (STATUS: ${status})` : fallback);

    throw new ApiError(message, { status });
}
