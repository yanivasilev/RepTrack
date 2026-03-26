import { State } from "./types/State";

export function initialState(): State {
    return {
        phase: "UP",
        reps: 0,
        repStartT: null,
        topShoulderY: null,
        bottomShoulderY: null,
        torsoLen: null,
        minElbowAngle: null,
        minPlankAngle: null,
        elbowSmoothed: null,
        confidenceFrames: 0,
        missingFrames: 0,
        repSignal: "SHOULDER_Y",
        repFrameCount: 0,
    };
}
