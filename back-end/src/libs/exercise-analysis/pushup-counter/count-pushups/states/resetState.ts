import { State } from "./types/State";

export function resetState(state: State): void {
    state.repStartT = null;
    state.topShoulderY = null;
    state.bottomShoulderY = null;
    state.minElbowAngle = null;
    state.minPlankAngle = null;
    state.elbowSmoothed = null;
    state.confidenceFrames = 0;
    state.missingFrames = 0;
    state.repSignal = "SHOULDER_Y";
    state.repFrameCount = 0;
}
