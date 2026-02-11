import { request } from "../customApi/request";

export type ChangePasswordPayload = {
    currentPassword: string;
    newPassword: string;
    newConfirmPassword: string;
};

export type ChangePasswordApiSuccess = {
    message?: string;
};

export function changePasswordApi(payload: ChangePasswordPayload) {
    return request<ChangePasswordApiSuccess>(
        {
            method: "PUT",
            url: "/settings/change-password",
            data: payload,
        },
        "Change password failed."
    );
}
