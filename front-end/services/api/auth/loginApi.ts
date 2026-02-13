import { request } from "../customApi/request";

export type LoginPayload = {
    email: string;
    password: string;
};

export type LoginApiSuccess = {
    message?: string;
    accessToken?: string;
};

export function LoginApi(payload: LoginPayload) {
    return request<LoginApiSuccess>(
        {
            method: "POST",
            url: "/auth/login",
            data: payload,
        },
        "Login failed."
    );
}
