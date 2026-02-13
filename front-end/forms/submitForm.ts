import { ApiError } from "../services/api/customApi/apiError";

export type FormResult<TFields extends string, TSuccess = unknown> =
    | { success: true; message: string; data: TSuccess }
    | { success: false; message: string; errors?: Partial<Record<TFields, string>> };

type SubmitFormOptions<TData, TFields extends string, TApiResponse, TSuccess> = {
    data: TData;
    validate?: (data: TData) => Partial<Record<TFields, string>> | null;
    apiCall: (data: TData) => Promise<TApiResponse>;
    successMessage: (res: TApiResponse) => string;
    fallbackErrorMessage?: string;
    transformSuccess?: (res: TApiResponse) => TSuccess;
};

export async function submitForm<TData, TFields extends string, TApiResponse, TSuccess = TApiResponse>(
    opts: SubmitFormOptions<TData, TFields, TApiResponse, TSuccess>
): Promise<FormResult<TFields, TSuccess>> {
    const { data, validate, apiCall, successMessage, fallbackErrorMessage, transformSuccess } = opts;

    const fieldErrors = validate?.(data) ?? null;
    if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        const firstMsg = (Object.values(fieldErrors).find(Boolean) as string) ?? "Validation failed.";
        return { success: false, message: firstMsg, errors: fieldErrors };
    }

    try {
        const res = await apiCall(data);
        const mapped = (transformSuccess ? transformSuccess(res) : (res as unknown as TSuccess));
        return { success: true, message: successMessage(res), data: mapped };
    } catch (e) {
        if (e instanceof ApiError) {
            const errors = e.fieldErrors as Partial<Record<TFields, string>> | undefined;
            const message =
                e.message ??
                (errors ? (Object.values(errors).find(Boolean) as string | undefined) : undefined) ??
                fallbackErrorMessage ??
                "Request failed.";

            return { success: false, message, errors };
        }

        return { success: false, message: fallbackErrorMessage ?? "Request failed." };
    }
}