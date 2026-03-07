import { ApiSucess } from "../../../libs/types/api-responds/ApiSuccess";
import { ChangeUsernameType } from "../../../libs/types/settings/ChangeUsernameType";
import { request } from "../customApi/request";

export function changeUsernameApi(payload: ChangeUsernameType) {
    return request<ApiSucess>(
        {
            method: "PUT",
            url: "/settings/change-username",
            data: payload,
        },
        "Change username failed."
    );
}
