import { ApiSucess } from "../../../libs/types/api-responds/ApiSuccess";
import { request } from "../customApi/request";

export function changeAvatarApi(uri: string, name: string, type: string) {
    const form = new FormData();

    form.append("avatar", {
        uri: uri,
        name: name,
        type: type,
    } as any);

    return request<ApiSucess>(
        {
            method: "PUT",
            url: "/settings/change-avatar",
            data: form,
        },
        "Change avatar failed."
    );
}
