import { submitForm } from "../../../forms/submitForm";
import { validateEmail } from "../../../forms/validations/validateEmail";
import { validateOtp } from "../../../forms/validations/validateOtp";
import { ApiSucess } from "../../../libs/types/api-responds/ApiSuccess";
import { EmailVerificationVerifyOtpType } from "../../../libs/types/auth/email-verification/EmailVerificationVerifyOtpType";
import { emailVerificationVerifyOtpApi } from "../../../services/api/auth/email-verification/emailVerificationVerifyOtpApi";

type Fields = keyof EmailVerificationVerifyOtpType;

export async function SubmitEmailVerificationVerifyOtp({ data }: { data: EmailVerificationVerifyOtpType }) {
    return submitForm<EmailVerificationVerifyOtpType, Fields, ApiSucess>({
        data,
        validate: (d) => {
            const errors: Partial<Record<Fields, string>> = {};

            const emailErr = validateEmail(d.email);
            if (emailErr) errors.email = emailErr;

            const otpErr = validateOtp(d.otp);
            if (otpErr) errors.otp = otpErr;

            return Object.keys(errors).length ? errors : null;
        },
        apiCall: emailVerificationVerifyOtpApi,
        successMessage: (res) => res?.message ?? "Email verified successfully.",
        fallbackErrorMessage: "Email verification failed.",
    });
}
