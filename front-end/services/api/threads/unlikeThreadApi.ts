import { LikeType } from "../../../libs/types/threads/LikeType";
import { request } from "../customApi/request";

export async function unlikeThreadApi(threadId: number) {

    return request<LikeType>(
        {
            method: "DELETE",
            url: `/threads/${threadId}/like`,
        },
        "Thread like failed."
    );
}