import { LikeType } from "../../../libs/types/threads/LikeType";
import { request } from "../customApi/request";

export async function likeThreadApi(threadId: number) {

    return request<LikeType>(
        {
            method: "POST",
            url: `/threads/${threadId}/like`,
        },
        "Thread like failed."
    );
}