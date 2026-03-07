import { LikeType } from "../../../../libs/types/threads/LikeType";
import { request } from "../../customApi/request";

export async function likeReplyApi(replyId: number) {

    return request<LikeType>(
        {
            method: "POST",
            url: `/reply/${replyId}/like`,
        },
        "Reply like failed."
    );
}