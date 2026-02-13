import { submitForm } from "../../forms/submitForm";
import { validateEmail } from "../../forms/validations/validateEmail";
import { validatePassword } from "../../forms/validations/validatePassword";
import { LoginApi, LoginPayload } from "../../services/api/auth/loginApi";

type Fields = keyof LoginPayload;

type LoginResponse =
    | { success: true; accessToken: string }
    | { success: false; message: string; errors?: Partial<Record<Fields, string>> };

type ApiRes = { message?: string; accessToken?: string };

export async function SubmitLogin({ data }: { data: LoginPayload }): Promise<LoginResponse> {
    const result = await submitForm<LoginPayload, Fields, ApiRes, { accessToken: string }>({
        data,
        validate: (d) => {
            const errors: Partial<Record<Fields, string>> = {};

            const emailError = validateEmail(d.email);
            if (emailError) errors.email = emailError;

            const passwordError = validatePassword(d.password);
            if (passwordError) errors.password = passwordError;

            return Object.keys(errors).length ? errors : null;
        },
        apiCall: LoginApi,
        successMessage: (res) => res?.message ?? "Login was successful.",
        fallbackErrorMessage: "Login failed.",

        transformSuccess: (res) => {
            if (!res?.accessToken) {
                // throw to force the error path (optional) OR return a default
                throw new Error("No accessToken returned from API");
            }
            return { accessToken: res.accessToken };
        },
    });

    if (result.success) {
        return { success: true, accessToken: result.data.accessToken };
    }

    return { success: false, message: result.message, errors: result.errors };
}