import { forgotPasswordApi } from "../../../services/api/auth/forgot-password/forgotPasswordApi";
import { submitForm } from "../../../forms/submitForm";
import { validateEmail } from "../../../forms/validations/validateEmail";
import { ForgotPasswordApiType } from "../../../libs/types/auth/forgot-password/ForgotPassowrdApiType";

type Fields = keyof ForgotPasswordApiType;

export async function SubmitForgotPassword({ data }: { data: ForgotPasswordApiType }) {
    return submitForm<ForgotPasswordApiType, Fields, { message?: string }>({
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
