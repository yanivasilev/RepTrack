import { request } from "../../customApi/request";

export type ForgotPasswordVerifyOtpPayload = {
    email: string;
    otp: string;
};

export type ForgotPasswordVerifyOtpApiSuccess = {
    message?: string;
    token: string;
};

export function forgotPasswordVerifyOtpApi(payload: ForgotPasswordVerifyOtpPayload) {
    return request<ForgotPasswordVerifyOtpApiSuccess>(
        {
            method: "POST",
            url: "/auth/forgot-password/verify",
            data: payload,
        },
        "OTP verification failed."
    );
}
