import { registerApi } from "../../services/api/auth/registerApi";
import { RegisterFormData } from "./RegisterForm";
import { RegisterValidationChecks } from "./RegisterValidationChecks";

export type Errors = Partial<Record<keyof RegisterFormData, string>>;

type RegistrationResponse =
    | { success: true }
    | { success: false; errors?: Errors; message?: string };

type SubmitRegistrationProps = {
    data: RegisterFormData;
};

function mapErrorstoRegisterForm(errs: Record<string, string>): Errors {
    const mapped: Errors = {};

    for (const [key, msg] of Object.entries(errs)) {
        mapped[key as keyof RegisterFormData] = msg;
    }

    return mapped;
}

export async function SubmitRegisterForm({ data }: SubmitRegistrationProps): Promise<RegistrationResponse> {
    // DATA VALIDATION CHECK
    const errors = RegisterValidationChecks(data);

    // RETURNS AN OBJECT WITH WHAT VALIDATIONS FAILED
    if (Object.keys(errors).length > 0) return { success: false, errors };

    try {
        // SUBMIT REGISTER DATA TO API
        await registerApi(data);
        return { success: true };
    } catch (e: any) {
        // WHEN register() THROWS A CUSTOM ERROR
        if (e?.fieldErrors && typeof e.fieldErrors === "object") {
            return {
                success: false,
                errors: mapErrorstoRegisterForm(e.fieldErrors),
                message: e?.message,
            };
        }

        // AXIOS RESPONSE
        const apiData = e?.response?.data;

        // BACKEND ERRORS
        if (apiData.errors.length) {
            const fe: Record<string, string> = {};
            for (const item of apiData.errors) {
                if (item?.field && item?.message && !fe[item.field]) {
                    fe[item.field] = item.message;
                }
            }

            if (Object.keys(fe).length) {
                return { success: false, errors: mapErrorstoRegisterForm(fe) };
            }
        }

        // OTHERWISE SHOW REGISTRATION FAILED
        return {
            success: false,
            message: apiData.message ?? e.message ?? "Registration failed.",
        };
    }
}
