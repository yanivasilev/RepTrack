import { ApiSuccessFormFeedback } from "../../../libs/types/api-responds/ApiSuccessFormFeedback";
import { request } from "../customApi/request";

export function formFeedbackApi(exerciseId: number, video: { uri: string, name: string, type: string }) {
    const form = new FormData();

    form.append("video", {
        uri: video.uri,
        name: video.name,
        type: video.type,
    } as any);

    return request<ApiSuccessFormFeedback>(
        {
            method: "POST",
            url: `/form-feedback/${exerciseId}`,
            data: form,
        },
        "Form Feedback Analysis failed."
    );
}
