import { loginApi } from "../../services/api/auth/loginApi";
import { LoginFormData } from "./LoginForm";

export type Errors = Partial<Record<keyof LoginFormData, string>>;

type LoginResponse =
    | { success: true, accessToken: string }
    | { success: false; errors?: Errors; message?: string };

type SubmitLoginProps = {
    data: LoginFormData;
};

function mapErrorsToLoginForm(errs: Record<string, string>): Errors {
    const mapped: Errors = {};

    for (const [key, msg] of Object.entries(errs)) {
        mapped[key as keyof LoginFormData] = msg;
    }

    return mapped;
}

export async function SubmitLogin({ data }: SubmitLoginProps): Promise<LoginResponse> {
    const errors: Errors = {};

    // EMAIL VALIDATION CHECKS
    const emailRegex =
        /^(?!\.)(?!.*\.{2,})([A-Z0-9_'+-\.]*)[A-Z0-9_'+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;

    if (data.email.length === 0) errors.email = "Email is required";
    else if (!emailRegex.test(data.email)) errors.email = "Email must be valid.";
    else if (data.email.length > 254) errors.email = "Email is too long.";

    // PASSWORD VALIDATION CHECKS
    if (data.password.length === 0) errors.password = "Password is required.";
    else if (data.password.length > 72)
        errors.password = "Password is too long.";

    // RETURNS AN OBJECT WITH WHAT VALIDATIONS FAILED
    if (Object.keys(errors).length > 0) return { success: false, errors };

    try {
        // SUBMIT REGISTER DATA TO API
        const res = await loginApi(data);
        return { success: true, accessToken: res.accessToken };
    } catch (e: any) {
        // WHEN login() THROWS A CUSTOM ERROR
        if (e?.errors && typeof e.errors === "object") {
            return {
                success: false,
                errors: mapErrorsToLoginForm(e.errors),
                message: e?.message
            }
        }

        // AXIOS RESPONSE
        const apiData = e?.response?.data;

        // BACKEND ERRORS
        if (apiData?.errors?.length) {
            const fe: Record<string, string> = {};
            for (const item of apiData.errors) {
                if (item?.field && item?.message && !fe[item.field]) {
                    fe[item.field] = item.message;
                }
            }

            if (Object.keys(fe).length) {
                return { success: false, errors: mapErrorsToLoginForm(fe) };
            }
        }

        // OTHERWISE SHOW LOGIN FAILED
        return {
            success: false,
            message: apiData?.message ?? e?.message ?? "Login failed.",
        };
    }
}
