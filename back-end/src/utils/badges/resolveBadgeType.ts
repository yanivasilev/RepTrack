import { BadgeType } from "../../../generated/prisma/enums";
import { BadgeMetrics } from "./getBadgeMetrics";
import { STREAK_THRESHOLDS, TOTAL_HOURS_THRESHOLDS, VOLUME_THRESHOLDS, WORKOUT_THRESHOLDS } from "./thresholds";

// DETERMINES WHICH BADGES USER QUALIGIES TO EARN
export function resolveBadgeType(metrics: BadgeMetrics): BadgeType[] {
    const result = new Set<BadgeType>();

    for (const threshold of WORKOUT_THRESHOLDS) {
        if (metrics.workoutsCount >= threshold.min) result.add(threshold.type);
    }

    for (const threshold of TOTAL_HOURS_THRESHOLDS) {
        if (metrics.totalDurationSeconds >= (threshold.minHours * 60 * 60)) result.add(threshold.type);
    }

    for (const threshold of STREAK_THRESHOLDS) {
        if (metrics.currentStreakDays >= threshold.min) result.add(threshold.type);
    }

    for (const threshold of VOLUME_THRESHOLDS) {
        if (metrics.totalVolume >= threshold.min) result.add(threshold.type);
    }

    return [...result];
}