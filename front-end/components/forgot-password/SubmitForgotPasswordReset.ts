// SubmitForgotPasswordResetForm.ts
import type { ForgotPasswordResetPayload } from "../../services/api/auth/forgot-password/forgotPasswordResetApi";
import { forgotPasswordResetApi } from "../../services/api/auth/forgot-password/forgotPasswordResetApi";
import { submitForm } from "../../forms/submitForm";
import { validateEmail } from "../../forms/validations/validateEmail";
import { validatePassword } from "../../forms/validations/validatePassword";
import { validateConfirmPassword } from "../../forms/validations/validateConfirmPassword";
import { validateToken } from "../../forms/validations/validateToken";

type Fields = keyof ForgotPasswordResetPayload;

type ForgotPasswordResetResponse =
    | { success: true; message: string }
    | { success: false; message: string; errors?: Partial<Record<Fields, string>> };

type ApiRes = { message?: string };

export async function SubmitForgotPasswordReset({ data }: { data: ForgotPasswordResetPayload }): Promise<ForgotPasswordResetResponse> {
    const result = await submitForm<ForgotPasswordResetPayload, Fields, ApiRes>({
        data,
        validate: (d) => {
            const errors: Partial<Record<Fields, string>> = {};

            const emailErr = validateEmail(d.email);
            if (emailErr) errors.email = emailErr;

            const tokenErr = validateToken(d.token);
            if (tokenErr) errors.token = tokenErr;

            const passErr = validatePassword(d.password);
            if (passErr) errors.password = passErr;

            const confirmErr = validateConfirmPassword(d.password, d.confirmPassword);
            if (confirmErr) errors.confirmPassword = confirmErr;

            return Object.keys(errors).length ? errors : null;
        },
        apiCall: forgotPasswordResetApi,
        successMessage: (res) => res?.message ?? "Password reset successful.",
        fallbackErrorMessage: "Reset password failed.",
    });

    return result;
}
