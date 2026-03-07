import { ApiSucess } from "../../../../libs/types/api-responds/ApiSuccess";
import { EmailVerificationType } from "../../../../libs/types/auth/email-verification/EmailVerificationType";
import { request } from "../../customApi/request";

export function emailVerificationApi(payload: EmailVerificationType) {
    return request<ApiSucess>(
        {
            method: "POST",
            url: "/auth/email-verification",
            data: payload,
        },
        "Email verification request failed."
    );
}
