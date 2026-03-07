import { WorkoutSuggestionType } from "../../../libs/types/workouts/WorkoutSuggestionType";
import { request } from "../customApi/request";

export async function workoutSuggestionApi(exerciseId: number) {
    return request<WorkoutSuggestionType | null>(
        {
            method: "GET",
            url: `/workouts-suggestion/${exerciseId}`,
        },
        "Loading workout suggestion failed."
    );
}
