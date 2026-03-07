import { ApiSuccessForgotPasswordVerifyOtp } from "../../../../libs/types/api-responds/ApiSucessForgotPasswordVerifyOtp";
import { ForgotPasswordVerifyOtpType } from "../../../../libs/types/auth/forgot-password/ForgotPasswordVerifyOtpType";
import { request } from "../../customApi/request";

export function forgotPasswordVerifyOtpApi(payload: ForgotPasswordVerifyOtpType) {
    return request<ApiSuccessForgotPasswordVerifyOtp>(
        {
            method: "POST",
            url: "/auth/forgot-password/verify",
            data: payload,
        },
        "OTP verification failed."
    );
}
