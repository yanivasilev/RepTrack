import { ApiSucess } from "../../../../libs/types/api-responds/ApiSuccess";
import { ForgotPasswordApiType } from "../../../../libs/types/auth/forgot-password/ForgotPassowrdApiType";
import { request } from "../../customApi/request";

export function forgotPasswordApi(payload: ForgotPasswordApiType) {
    return request<ApiSucess>(
        {
            method: "POST",
            url: "/auth/forgot-password",
            data: payload,
        },
        "Forgot password failed."
    );
}
