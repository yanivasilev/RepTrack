import { WorkoutStatsResponseType } from "../../../libs/types/workouts/workout-dashboard/WorkoutStatsResponseType";
import { request } from "../customApi/request";

export async function workoutStatsApi() {

    return request<WorkoutStatsResponseType>(
        {
            method: "GET",
            url: "/workouts-stats",
        },
        "Workout stats failed."
    );
}
