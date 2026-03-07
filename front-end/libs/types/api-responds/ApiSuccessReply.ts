import { ReplyType } from "../threads/ReplyType";

export type ApiSuccessReply = {
    message?: string;
    reply: Partial<ReplyType> & { id: number };
};
