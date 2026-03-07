import { ApiSucess } from "../../../../libs/types/api-responds/ApiSuccess";
import { ForgotPasswordResetType } from "../../../../libs/types/auth/forgot-password/ForgotPasswordResetType";
import { request } from "../../customApi/request";

export function forgotPasswordResetApi(payload: ForgotPasswordResetType) {
    return request<ApiSucess>(
        {
            method: "POST",
            url: "/auth/forgot-password/reset",
            data: payload,
        },
        "Reset password failed."
    );
}
