import { ProfileDetailsType } from "../../../libs/types/profiles/ProfileDetailsType";
import { request } from "../customApi/request";

export function getProfileApi() {
    return request<ProfileDetailsType>(
        {
            method: "GET",
            url: "/profiles/me",
        },
        "Profile details failed."
    );
}
