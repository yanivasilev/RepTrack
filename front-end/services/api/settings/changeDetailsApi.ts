import { ApiSucess } from "../../../libs/types/api-responds/ApiSuccess";
import { ChangeDetailsType } from "../../../libs/types/settings/ChangeDetailsType";
import { request } from "../customApi/request";

export function changeDetailsApi(payload: ChangeDetailsType) {
    return request<ApiSucess>(
        {
            method: "PUT",
            url: "/settings/change-details",
            data: payload,
        },
        "Change details failed."
    );
}
