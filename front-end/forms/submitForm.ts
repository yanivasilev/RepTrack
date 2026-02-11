import { ApiError } from "../services/api/customApi/apiError";

export type FormResult<TFields extends string, TSuccess = unknown> =
    | { success: true; message: string; data: TSuccess }
    | { success: false; message: string; errors?: Partial<Record<TFields, string>> };

type SubmitFormOptions<TData, TFields extends string, TApiResponse> = {
    data: TData;
    validate?: (data: TData) => Partial<Record<TFields, string>> | null;
    apiCall: (data: TData) => Promise<TApiResponse>;
    successMessage: (res: TApiResponse) => string;
    fallbackErrorMessage?: string;
};

export async function submitForm<TData, TFields extends string, TApiResponse>(opts: SubmitFormOptions<TData, TFields, TApiResponse>): Promise<FormResult<TFields, TApiResponse>> {
    const { data, validate, apiCall, successMessage, fallbackErrorMessage } = opts;

    // 1) CLIENT VALIDATION
    const fieldErrors = validate?.(data) ?? null;
    if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        const firstMsg = (Object.values(fieldErrors).find(Boolean) as string) ?? "Validation failed.";

        return { success: false, message: firstMsg, errors: fieldErrors };
    }

    // 2) API
    try {
        const res = await apiCall(data);

        return { success: true, message: successMessage(res), data: res };
    } catch (e) {
        // 3) NORMALISE API ERRORS
        if (e instanceof ApiError) {
            const errors = e.fieldErrors as Partial<Record<TFields, string>> | undefined;
            const message =
                e.message ??
                (errors ? Object.values(errors).find(Boolean) : undefined) ??
                fallbackErrorMessage ??
                "Request failed.";

            return { success: false, message, errors };
        }

        // UNKNOWN ERROR
        return {
            success: false,
            message: fallbackErrorMessage ?? "Request failed.",
        };
    }
}
