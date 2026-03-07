import { gradeRep } from "../gradeRep";
import { RepFeedback } from "../types/RepFeedback";
import { CONFIG } from "./config";
import { State } from "./states/types/State";

export function evaluateRep(state: State, endT: number): RepFeedback | null {
    if (state.repStartT == null) return null;
    if (state.repFrameCount < 2) return null;

    const duration = endT - state.repStartT;

    // REJECT MICRO REPS
    if (duration < 0.08) return null;

    const torsoLen = state.torsoLen ?? 0;
    const travel = state.topShoulderY != null && state.bottomShoulderY != null ? state.bottomShoulderY - state.topShoulderY : 0;

    const travelFrac = torsoLen > 0 ? travel / torsoLen : Math.abs(travel);
    const lowConfidence = state.confidenceFrames < 3 || state.missingFrames > CONFIG.REP.MAX_MISSING_FRAMES;

    const metrics = {
        duration,
        travel,
        travelFrac,
        minElbowAngle: state.minElbowAngle ?? 999,
        minPlankAngle: state.minPlankAngle ?? 999,
        confidenceFrames: state.confidenceFrames,
        missingFrames: state.missingFrames,
        signal: state.repSignal,
    };

    const graded = gradeRep({
        duration,
        travelFrac,
        minElbowAngle: metrics.minElbowAngle,
        minPlankAngle: metrics.minPlankAngle,
        lowConfidence,
    });

    return {
        repIndex: state.reps + 1,
        tStart: state.repStartT,
        tEnd: endT,
        code: graded.code,
        message: graded.message,
        metrics,
    };
}
