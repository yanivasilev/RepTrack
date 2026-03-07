import { forgotPasswordVerifyOtpApi } from "../../../services/api/auth/forgot-password/forgotPasswordVerifyOtpApi";
import { submitForm } from "../../../forms/submitForm";
import { validateEmail } from "../../../forms/validations/validateEmail";
import { validateOtp } from "../../../forms/validations/validateOtp";
import { ApiSuccessForgotPasswordVerifyOtp } from "../../../libs/types/api-responds/ApiSucessForgotPasswordVerifyOtp";
import { ForgotPasswordVerifyOtpType } from "../../../libs/types/auth/forgot-password/ForgotPasswordVerifyOtpType";

type Fields = keyof ForgotPasswordVerifyOtpType;

type ForgotPasswordVerifyOtpResponse =
    | { success: true; message: string; token: string }
    | { success: false; message: string; errors?: Partial<Record<Fields, string>> };

export async function SubmitForgotPasswordVerifyOtp({ data }: { data: ForgotPasswordVerifyOtpType }): Promise<ForgotPasswordVerifyOtpResponse> {
    const result = await submitForm<ForgotPasswordVerifyOtpType, Fields, ApiSuccessForgotPasswordVerifyOtp>({
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
