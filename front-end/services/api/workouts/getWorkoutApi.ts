import { WorkoutDetailsType } from "../../../libs/types/workouts/workout-details/WorkoutDetailsType";
import { request } from "../customApi/request";

export async function getWorkoutApi(workoutId: number) {

    return request<{ workout: WorkoutDetailsType }>(
        {
            method: "GET",
            url: `/workouts/${workoutId}`,
        },
        "Loading workout failed."
    );
}
