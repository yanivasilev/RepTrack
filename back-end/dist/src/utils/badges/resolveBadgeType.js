"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveBadgeTypes = resolveBadgeTypes;
const thresholds_1 = require("./thresholds");
function resolveBadgeTypes(metrics) {
    const result = new Set();
    for (const threshold of thresholds_1.WORKOUT_THRESHOLDS) {
        if (metrics.workoutsCount >= threshold.min)
            result.add(threshold.type);
    }
    for (const threshold of thresholds_1.TOTAL_HOURS_THRESHOLDS) {
        if (metrics.totalDurationSeconds >= (threshold.minHours * 60 * 60))
            result.add(threshold.type);
    }
    for (const threshold of thresholds_1.STREAK_THRESHOLDS) {
        if (metrics.currentStreakDays >= threshold.min)
            result.add(threshold.type);
    }
    for (const threshold of thresholds_1.VOLUME_THRESHOLDS) {
        if (metrics.totalVolume >= threshold.min)
            result.add(threshold.type);
    }
    return [...result];
}
