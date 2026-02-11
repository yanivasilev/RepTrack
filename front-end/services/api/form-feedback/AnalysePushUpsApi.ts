import { request } from "../customApi/request";

export type PushupFeedbackCode = "NOT_PUSHUP" | "NO_REPS" | "OK";

export type RepFeedbackCode =
    | "GOOD"
    | "TOO_SHALLOW"
    | "BAD_PLANK"
    | "TOO_FAST"
    | "TOO_SLOW"
    | "NO_TRAVEL"
    | "LOW_CONFIDENCE";

export type RepFeedback = {
    repIndex: number;
    tStart: number;
    tEnd: number;
    code: RepFeedbackCode;
    message: string;
    metrics: {
        duration: number;
        travel: number;
        travelFrac: number;
        minElbowAngle: number;
        minPlankAngle: number;
        confidenceFrames: number;
        missingFrames: number;
        signal: "ELBOW" | "SHOULDER_Y";
    };
};

export type PushupFeedback = {
    code: PushupFeedbackCode;
    message: string;
};

export type PushupResult = {
    reps: number;
    usedFrames: number;
    isLikelyPushup: boolean;
    feedback: PushupFeedback;
    repFeedbacks: RepFeedback[];
    goodReps: number;
    badReps: number;
    debug?: {
        usedFrames?: number;
        params?: Record<string, number>;
        gateHits?: number;
        shoulderMotionHits?: number;
    };
};

export type AnalyzePushupsPayload = {
    uri: string;
    name: string;
    type: string;
};

export type AnalyzePushupsSuccess = PushupResult & {
    fps: number;
    frameCount: number;
    usedFrames: number;
    reps: number;
    timingsMs: {
        extractFrames: number;
        pose: number;
        count: number;
        cleanup: number;
        total: number;
    };
};

export function analysePushupsApi(payload: AnalyzePushupsPayload) {
    const form = new FormData();

    form.append("video", {
        uri: payload.uri,
        name: payload.name,
        type: payload.type,
    } as any);

    return request<AnalyzePushupsSuccess>(
        {
            method: "POST",
            url: "/pushup?forceError=1",
            data: form,
        },
        "Pushup analysis failed."
    );
}
