import { ApiSuccessWorkout } from "../../../libs/types/api-responds/ApiSuccessWorkout";
import { SaveWorkoutType } from "../../../libs/types/workouts/workout-start/saveWorkoutType";
import { request } from "../customApi/request";

export async function saveWorkoutApi(payload: SaveWorkoutType) {
    return request<ApiSuccessWorkout>(
        {
            method: "POST",
            url: "/workouts",
            data: payload
        },
        "Saving workout failed."
    );
}
