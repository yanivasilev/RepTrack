import { ApiSuccessThread } from "../../../libs/types/api-responds/ApiSuccessThread";
import { request } from "../customApi/request";

export async function editThreadApi(threadId: number, title: string, body: string) {
    return request<ApiSuccessThread>(
        {
            method: "PATCH",
            url: `/threads/${threadId}`,
            data: { title, body }
        },
        "Edit thread failed."
    );
}