export type PushupFeedbackCode = "NOT_PUSHUP" | "NO_REPS" | "OK";

export type PushupFeedbackType = {
    code: PushupFeedbackCode;
    message: string;
};
