import { CONFIG } from "../config";

export function getDynamicThresholds(torsoLen: number | null) {
    if (torsoLen && torsoLen > 0) {
        return {
            startDown: CONFIG.MOTION.START_DOWN_TORSO_FRACTION * torsoLen,
            endUp: CONFIG.MOTION.END_UP_TORSO_FRACTION * torsoLen,
        };
    }

    return {
        startDown: CONFIG.MOTION.FALLBACK_START_DOWN_DELTA,
        endUp: CONFIG.MOTION.FALLBACK_END_UP_DELTA,
    };
}