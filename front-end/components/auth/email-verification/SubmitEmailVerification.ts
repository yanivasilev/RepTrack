import { submitForm } from "../../../forms/submitForm";
import { validateEmail } from "../../../forms/validations/validateEmail";
import { ApiSucess } from "../../../libs/types/api-responds/ApiSuccess";
import { EmailVerificationType } from "../../../libs/types/auth/email-verification/EmailVerificationType";
import { emailVerificationApi } from "../../../services/api/auth/email-verification/emailVerificationApi";

type Fields = keyof EmailVerificationType;

export async function SubmitEmailVerification({ data }: { data: EmailVerificationType }) {
    return submitForm<EmailVerificationType, Fields, ApiSucess>({
        data,
        validate: (d) => {
            const emailError = validateEmail(d.email);
            return emailError ? { email: emailError } : null;
        },
        apiCall: emailVerificationApi,
        successMessage: (res) => res?.message ?? "If an account exists, your verification code has been sent.",
        fallbackErrorMessage: "Email verification request failed.",
    });
}
