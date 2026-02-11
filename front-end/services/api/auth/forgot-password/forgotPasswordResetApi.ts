import { request } from "../../customApi/request";

export type ForgotPasswordResetPayload = {
    email: string;
    token: string;
    password: string;
    confirmPassword: string;
};

export type ForgotPasswordResetApiSuccess = {
    message?: string;
};

export function forgotPasswordResetApi(payload: ForgotPasswordResetPayload) {
    return request<ForgotPasswordResetApiSuccess>(
        {
            method: "POST",
            url: "/auth/forgot-password/reset",
            data: payload,
        },
        "Reset password failed."
    );
}
