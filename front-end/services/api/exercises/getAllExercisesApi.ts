import { Exercise } from "../../../libs/types/common/exercises/Exercise";
import { Paginated } from "../../../libs/types/Paginated";
import { request } from "../customApi/request";

export async function getAllExercisesApi(params?: { page?: number; limit?: number; query?: string }) {
    const { page = 1, limit = 20, query } = params ?? {};
    const queries = new URLSearchParams();

    queries.set("page", String(page));
    queries.set("limit", String(limit));

    if (query) queries.set("query", query);

    return request<Paginated<Exercise>>(
        {
            method: "GET",
            url: `/exercises?${queries.toString()}`,
        },
        "Loading exercises failed."
    );
}