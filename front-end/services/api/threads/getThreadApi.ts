import { Paginated } from "../../../libs/types/Paginated";
import { ReplyType } from "../../../libs/types/threads/ReplyType";
import { ThreadType } from "../../../libs/types/threads/ThreadType";
import { request } from "../customApi/request";

export type getThreadsPayload = {
    thread: ThreadType;
    replies: Paginated<ReplyType>
}

export async function getThreadApi(threadId: number, params?: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = params ?? {};
    const queries = new URLSearchParams();

    queries.set("repliesPage", String(page));
    queries.set("repliesLimit", String(limit));

    return request<getThreadsPayload>(
        {
            method: "GET",
            url: `/threads/${threadId}?${queries.toString()}`,
        },
        "Loading thread failed."
    );
}