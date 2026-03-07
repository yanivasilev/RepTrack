import { ApiSuccessLogin } from "../../../libs/types/api-responds/ApiSuccessLogin";
import { LoginFormType } from "../../../libs/types/auth/LoginFormType";
import { request } from "../customApi/request";

export function loginApi(payload: LoginFormType) {
    return request<ApiSuccessLogin>(
        {
            method: "POST",
            url: "/auth/login",
            data: payload,
        },
        "Login failed."
    );
}
