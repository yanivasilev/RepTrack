import { ApiSucess } from "../../../../libs/types/api-responds/ApiSuccess";
import { request } from "../../customApi/request";

export async function deleteReplyApi(replyId: number) {
    return request<ApiSucess>(
        {
            method: "DELETE",
            url: `/reply/${replyId}`
        },
        "Delete reply failed."
    );
}