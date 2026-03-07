import { ApiSuccessReply } from "../../../../libs/types/api-responds/ApiSuccessReply";
import { request } from "../../customApi/request";

export async function createReplyApi(threadId: number, body: string) {
    return request<ApiSuccessReply>(
        {
            method: "POST",
            url: `/reply/${threadId}`,
            data: { body }
        },
        "Creating reply failed."
    );
}
