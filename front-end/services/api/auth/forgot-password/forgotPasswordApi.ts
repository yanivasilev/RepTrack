import { request } from "../../customApi/request";

export type ForgotPasswordPayload = {
    email: string;
};

export type ForgotPasswordApiSuccess = {
    message?: string;
};

export function forgotPasswordApi(payload: ForgotPasswordPayload) {
    return request<ForgotPasswordApiSuccess>(
        {
            method: "POST",
            url: "/auth/forgot-password",
            data: payload,
        },
        "Forgot password failed."
    );
}
