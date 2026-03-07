import { ApiSucess } from "../../../../libs/types/api-responds/ApiSuccess";
import { EmailVerificationVerifyOtpType } from "../../../../libs/types/auth/email-verification/EmailVerificationVerifyOtpType";
import { request } from "../../customApi/request";

export function emailVerificationVerifyOtpApi(payload: EmailVerificationVerifyOtpType) {
    return request<ApiSucess>(
        {
            method: "POST",
            url: "/auth/email-verification/verify",
            data: payload,
        },
        "Email verification failed."
    );
}
