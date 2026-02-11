import { request } from "../customApi/request";

export type ChangeAvatarPayload = {
    uri: string;
    name: string;
    type: string;
};

export type ChangeAvatarApiSuccess = {
    message?: string;
};

export function changeAvatarApi(payload: ChangeAvatarPayload) {
    const form = new FormData();

    form.append("avatar", {
        uri: payload.uri,
        name: payload.name,
        type: payload.type,
    } as any);

    return request<ChangeAvatarApiSuccess>(
        {
            method: "PUT",
            url: "/settings/change-avatar",
            data: form,
        },
        "Change avatar failed."
    );
}
