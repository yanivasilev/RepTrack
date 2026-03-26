import { ApiSuccessExerciseAnalysis } from "../../../libs/types/api-responds/ApiSuccessExerciseAnalysis";
import { request } from "../customApi/request";

export function exerciseAnalysisApi(exerciseId: number, video: { uri: string, name: string, type: string }) {
    const form = new FormData();

    // ATTACHES VIDEO FILE TO THE REQUEST BODY
    form.append("video", {
        uri: video.uri,
        name: video.name,
        type: video.type,
    } as any);

    // SENDS POST REQUEST TO THE EXERCISE ANALYSIS ENDPOINT
    return request<ApiSuccessExerciseAnalysis>(
        {
            method: "POST",
            url: `/exercise-analysis/${exerciseId}`,
            data: form,
        },
        "Exercise Analysis failed."
    );
}
