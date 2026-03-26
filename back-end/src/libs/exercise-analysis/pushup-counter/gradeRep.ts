export function gradeRep(rep: { duration: number; travelFrac: number; minElbowAngle: number; minPlankAngle: number; lowConfidence: boolean }) {
    const DEPTH_GOOD = 105;
    const PLANK_GOOD = 165;

    const MIN_TRAVEL_FRAC = 0.10;
    const FAST = 0.30;
    const SLOW = 6.5;

    if (rep.lowConfidence) return { code: "LOW_CONFIDENCE" as const, message: "View was shaky, try a better lighting and keep full body in frame." };
    if (rep.minPlankAngle !== 999 && rep.minPlankAngle < PLANK_GOOD) return { code: "BAD_PLANK" as const, message: "Keep a straight plank, avoid hips hiking." };
    if (rep.minElbowAngle !== 999 && rep.minElbowAngle > DEPTH_GOOD) return { code: "TOO_SHALLOW" as const, message: "Go lower for full depth." };
    if (rep.travelFrac < MIN_TRAVEL_FRAC) return { code: "NO_TRAVEL" as const, message: "Lower your chest more." };
    if (rep.duration < FAST) return { code: "TOO_FAST" as const, message: "Slow down and control the rep." };
    if (rep.duration > SLOW) return { code: "TOO_SLOW" as const, message: "Too slow increase the tempo." };

    return { code: "GOOD" as const, message: "Good rep!" };
}