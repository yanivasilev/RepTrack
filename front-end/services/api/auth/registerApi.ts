import { ApiSucess } from "../../../libs/types/api-responds/ApiSuccess";
import { RegisterFormType } from "../../../libs/types/auth/RegisterFormType";
import { request } from "../customApi/request";

export function registerApi(payload: RegisterFormType) {
    return request<ApiSucess>(
        {
            method: "POST",
            url: "/auth/register",
            data: payload,
        },
        "Register failed."
    );
}
