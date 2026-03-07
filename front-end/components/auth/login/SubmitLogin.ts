import { submitForm } from "../../../forms/submitForm";
import { validateEmail } from "../../../forms/validations/validateEmail";
import { validatePassword } from "../../../forms/validations/validatePassword";
import { ApiSuccessLogin } from "../../../libs/types/api-responds/ApiSuccessLogin";
import { LoginFormType } from "../../../libs/types/auth/LoginFormType";
import { loginApi } from "../../../services/api/auth/loginApi";

type Fields = keyof LoginFormType;

type LoginResponse =
    | { success: true; accessToken: string }
    | {
        success: false;
        message: string;
        errors?: Partial<Record<Fields, string>>;
        requiresEmailVerification?: boolean;
    };

export async function SubmitLogin({ data }: { data: LoginFormType }): Promise<LoginResponse> {
    const result = await submitForm<LoginFormType, Fields, ApiSuccessLogin, { accessToken: string }>({
        data,
        validate: (d) => {
            const errors: Partial<Record<Fields, string>> = {};

            const emailError = validateEmail(d.email);
            if (emailError) errors.email = emailError;

            const passwordError = validatePassword(d.password);
            if (passwordError) errors.password = passwordError;

            return Object.keys(errors).length ? errors : null;
        },
        apiCall: loginApi,
        successMessage: (res) => res?.message ?? "Login was successful.",
        fallbackErrorMessage: "Login failed."
    });

    if (!result.success) {
        const requiresEmailVerification = result.message.toLowerCase().includes("verify your email");
        return {
            success: false,
            message: result.message,
            errors: result.errors,
            requiresEmailVerification,
        };
    }

    if (!result.data?.accessToken) return { success: false, message: "" };

    return { success: true, accessToken: result.data.accessToken };
}
