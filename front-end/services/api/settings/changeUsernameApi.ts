import { request } from "../customApi/request";

export type ChangeUsernamePayload = {
    username: string;
};

export type ChangeUsernameApiSuccess = {
    message?: string;
};

export function changeUsernameApi(payload: ChangeUsernamePayload) {
    return request<ChangeUsernameApiSuccess>(
        {
            method: "PUT",
            url: "/settings/change-username",
            data: payload,
        },
        "Change username failed."
    );
}
