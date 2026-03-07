import { Paginated } from "../../../libs/types/Paginated";
import { ProfileType } from "../../../libs/types/profiles/ProfileType";
import { request } from "../customApi/request";

export async function getAllProfilesApi(params?: { page?: number; limit?: number; query?: string }) {
    const { page = 1, limit = 10, query } = params ?? {};
    const queries = new URLSearchParams();

    queries.set("page", String(page));
    queries.set("limit", String(limit));

    if (query) queries.set("query", query);

    return request<Paginated<ProfileType>>(
        {
            method: "GET",
            url: `/profiles?${queries.toString()}`,
        },
        "Loading profiles failed."
    );
}
