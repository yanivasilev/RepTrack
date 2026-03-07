import { LikeType } from "../../../../libs/types/threads/LikeType";
import { request } from "../../customApi/request";

export async function unlikeReplyApi(replyId: number) {

    return request<LikeType>(
        {
            method: "DELETE",
            url: `/reply/${replyId}/like`,
        },
        "Reply like failed."
    );
}