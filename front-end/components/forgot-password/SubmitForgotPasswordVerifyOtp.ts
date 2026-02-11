import type { ForgotPasswordVerifyOtpPayload } from "../../services/api/auth/forgot-password/forgotPasswordVerifyOtpApi";
import { forgotPasswordVerifyOtpApi } from "../../services/api/auth/forgot-password/forgotPasswordVerifyOtpApi";
import { submitForm } from "../../forms/submitForm";
import { validateEmail } from "../../forms/validations/validateEmail";
import { validateOtp } from "../../forms/validations/validateOtp";

type Fields = "email" | "otp";

type VerifyOtpApiRes = {
    message?: string;
    token: string;
};

type ForgotPasswordVerifyOtpResponse =
    | { success: true; message: string; token: string }
    | { success: false; message: string; errors?: Partial<Record<Fields, string>> };

export async function SubmitForgotPasswordVerifyOtp({ data }: { data: ForgotPasswordVerifyOtpPayload }): Promise<ForgotPasswordVerifyOtpResponse> {
    const result = await submitForm<ForgotPasswordVerifyOtpPayload, Fields, VerifyOtpApiRes>({
        data,
        validate: (d) => {
            const errors: Partial<Record<Fields, string>> = {};

            const emailErr = validateEmail(d.email);
            if (emailErr) errors.email = emailErr;

            const otpErr = validateOtp(d.otp);
            if (otpErr) errors.otp = otpErr;

            return Object.keys(errors).length ? errors : null;
        },
        apiCall: forgotPasswordVerifyOtpApi,
        successMessage: (res) => res.message ?? "OTP verified.",
        fallbackErrorMessage: "OTP verification failed.",
    });

    if (!result.success) return result;

    return {
        success: true,
        message: result.message,
        token: result.data.token,
    };
}
