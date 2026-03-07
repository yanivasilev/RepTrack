import { ThreadType } from "../threads/ThreadType";

export type ApiSuccessThread = {
    message?: string;
    thread: Partial<ThreadType> & { id: number };
};