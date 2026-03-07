import { ApiSucess } from "../../../libs/types/api-responds/ApiSuccess";
import { ChangePasswordType } from "../../../libs/types/settings/ChangePasswordType";
import { request } from "../customApi/request";

export function changePasswordApi(payload: ChangePasswordType) {
    return request<ApiSucess>(
        {
            method: "PUT",
            url: "/settings/change-password",
            data: payload,
        },
        "Change password failed."
    );
}
