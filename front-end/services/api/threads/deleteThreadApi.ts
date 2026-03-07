import { ApiSucess } from "../../../libs/types/api-responds/ApiSuccess";
import { request } from "../customApi/request";

export async function deleteThreadApi(threadId: number) {
    return request<ApiSucess>(
        {
            method: "DELETE",
            url: `/threads/${threadId}`
        },
        "Delete thread failed."
    );
}