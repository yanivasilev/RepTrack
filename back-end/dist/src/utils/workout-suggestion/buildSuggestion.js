"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSuggestion = buildSuggestion;
function buildSuggestion(exerciseType, history, toOneDecimal) {
    if (history.length === 0)
        return null;
    const latest = history[0];
    const previous = history[1] ?? null;
    if (exerciseType === "REPS") {
        const currentWeight = latest.averageWeight ?? latest.maxWeight ?? 0;
        if (currentWeight <= 0)
            return null;
        const previousWeight = previous ? (previous.averageWeight ?? previous.maxWeight ?? 0) : currentWeight;
        const stableOnWeight = previous ? currentWeight >= previousWeight * 0.98 : true;
        const progressedOnReps = previous ? latest.totalReps >= previous.totalReps : latest.totalReps > 0;
        const canIncrease = stableOnWeight && progressedOnReps;
        const stepWeight = currentWeight < 20 ? 1 : 2.5;
        const delta = canIncrease ? stepWeight : 0;
        const suggestedValue = toOneDecimal(currentWeight + delta);
        return {
            action: canIncrease ? "increase" : "maintain",
            suggestedValue,
            delta: toOneDecimal(delta),
            message: canIncrease
                ? "Recent sessions are stable or improving. Try a small weight increase."
                : "Performance is not consistent yet. Keep the same weight.",
        };
    }
    const currentDuration = latest.totalDurationSeconds;
    if (currentDuration <= 0)
        return null;
    const previousDuration = previous?.totalDurationSeconds ?? currentDuration;
    const canIncrease = previous ? currentDuration >= previousDuration : true;
    const delta = canIncrease ? Math.max(10, Math.round(currentDuration * 0.1)) : 0;
    return {
        action: canIncrease ? "increase" : "maintain",
        suggestedValue: currentDuration + delta,
        delta,
        message: canIncrease
            ? "Recent sessions are stable or improving. Try a small time increase."
            : "Latest session dropped. Keep the same duration for now.",
    };
}
