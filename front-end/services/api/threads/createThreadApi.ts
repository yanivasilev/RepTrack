import { ApiSuccessThread } from "../../../libs/types/api-responds/ApiSuccessThread";
import { request } from "../customApi/request";

export async function createThreadApi(title: string, body: string) {
    return request<ApiSuccessThread>(
        {
            method: "POST",
            url: "/threads",
            data: { title, body },
        },
        "Creating thread failed."
    );
}
