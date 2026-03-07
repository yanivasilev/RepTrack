import { ProfileDetailsType } from "../../../libs/types/profiles/ProfileDetailsType";
import { request } from "../customApi/request";

export function getProfileByIdApi(userId: number) {
    return request<ProfileDetailsType>(
        {
            method: "GET",
            url: `/profiles/${userId}`,
        },
        "Profile details failed."
    );
}
