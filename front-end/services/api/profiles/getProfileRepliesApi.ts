import { Paginated } from "../../../libs/types/Paginated";
import { ProfileReplyType } from "../../../libs/types/profiles/ProfileReplyType";
import { request } from "../customApi/request";

export async function getProfileRepliesApi(userId: number, params?: { page?: number; limit?: number; query?: string }) {
    const { page = 1, limit = 10, query } = params ?? {};
    const queries = new URLSearchParams();

    queries.set("page", String(page));
    queries.set("limit", String(limit));
    if (query) queries.set("query", query);

    return request<Paginated<ProfileReplyType>>(
        {
            method: "GET",
            url: `/profiles/${userId}/replies?${queries.toString()}`,
        },
        "Loading profile replies failed."
    );
}

