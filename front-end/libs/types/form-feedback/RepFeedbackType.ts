export type RepFeedbackCode =
    | "GOOD"
    | "TOO_SHALLOW"
    | "BAD_PLANK"
    | "TOO_FAST"
    | "TOO_SLOW"
    | "NO_TRAVEL"
    | "LOW_CONFIDENCE";

export type RepFeedbackType = {
    repIndex: number;
    tStart: number;
    tEnd: number;
    code: RepFeedbackCode;
    message: string;
};
