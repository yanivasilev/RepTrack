import { Paginated } from "../../../libs/types/Paginated";
import { ThreadType } from "../../../libs/types/threads/ThreadType";
import { request } from "../customApi/request";

export async function getAllThreadsApi(params?: { page?: number; limit?: number; query?: string }) {
    const { page = 1, limit = 10, query } = params ?? {};
    const queries = new URLSearchParams();

    queries.set("page", String(page));
    queries.set("limit", String(limit));

    if (query) queries.set("query", query);

    return request<Paginated<ThreadType>>(
        {
            method: "GET",
            url: `/threads?${queries.toString()}`,
        },
        "Loading threads failed."
    );
}