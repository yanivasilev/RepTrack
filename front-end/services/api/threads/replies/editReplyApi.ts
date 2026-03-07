import { ApiSuccessReply } from "../../../../libs/types/api-responds/ApiSuccessReply";
import { request } from "../../customApi/request";

export async function editReplyApi(replyId: number, body: string) {
    return request<ApiSuccessReply>(
        {
            method: "PATCH",
            url: `/reply/${replyId}`,
            data: { body }
        },
        "Edit reply failed."
    );
}
