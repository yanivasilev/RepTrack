import { ApiSucess } from "../../../libs/types/api-responds/ApiSuccess";
import { request } from "../customApi/request";

export async function deleteWorkoutApi(workoutId: number) {
    return request<ApiSucess>(
        {
            method: "DELETE",
            url: `/workouts/delete/${workoutId}`,
        },
        "Deleting workout failed."
    );
}
