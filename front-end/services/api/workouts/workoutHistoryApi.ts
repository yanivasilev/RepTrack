import { Paginated } from "../../../libs/types/Paginated";
import { WorkoutHistoryItemType } from "../../../libs/types/workouts/WorkoutHistoryItemType";
import { request } from "../customApi/request";

export async function workoutHistoryApi(params?: { page?: number; limit?: number; from?: Date, to?: Date, sort?: string }) {
    const { page = 1, limit = 10, from, to, sort = "latest" } = params ?? {};
    const queries = new URLSearchParams();

    queries.set("page", String(page));
    queries.set("limit", String(limit));
    queries.set("sort", String(sort));

    if (from) {
        const startOfDay = new Date(from);
        startOfDay.setHours(0, 0, 0, 0);
        queries.set("from", startOfDay.toISOString());
    }

    if (to) {
        const endOfDay = new Date(to);
        endOfDay.setHours(23, 59, 59, 999);
        queries.set("to", endOfDay.toISOString());
    }

    return request<Paginated<WorkoutHistoryItemType>>(
        {
            method: "GET",
            url: `/workouts-history?${queries.toString()}`,
        },
        "Loading workout history failed."
    );
}
