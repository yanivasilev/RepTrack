import { ReplyType } from "../threads/ReplyType";

export type ProfileReplyType = ReplyType & {
    thread: {
        id: number;
        title: string;
    };
};

