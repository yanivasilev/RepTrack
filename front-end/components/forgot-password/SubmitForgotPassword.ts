import { forgotPasswordApi, ForgotPasswordPayload } from "../../services/api/auth/forgot-password/forgotPasswordApi";
import { submitForm } from "../../forms/submitForm";
import { validateEmail } from "../../forms/validations/validateEmail";

type Fields = keyof ForgotPasswordPayload;

export async function SubmitForgotPassword({ data }: { data: ForgotPasswordPayload }) {
    return submitForm<ForgotPasswordPayload, Fields, { message?: string }>({
        data,
        validate: (d) => {
            const emailError = validateEmail(d.email);
            return emailError ? { email: emailError } : null;
        },
        apiCall: forgotPasswordApi,
        successMessage: (res) => res?.message ?? "If an account exists, your verification code has been sent.",
        fallbackErrorMessage: "Forgot password failed.",
    });
}
