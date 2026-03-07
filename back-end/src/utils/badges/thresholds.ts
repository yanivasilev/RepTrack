import { BadgeType } from "../../../generated/prisma/enums";

export const WORKOUT_THRESHOLDS: Array<{ type: BadgeType; min: number }> = [
    { type: BadgeType.FIRST_WORKOUT, min: 1 },
    { type: BadgeType.WORKOUTS_5, min: 5 },
    { type: BadgeType.WORKOUTS_15, min: 15 },
    { type: BadgeType.WORKOUTS_20, min: 20 },
    { type: BadgeType.WORKOUTS_25, min: 25 },
    { type: BadgeType.WORKOUTS_50, min: 50 },
    { type: BadgeType.WORKOUTS_75, min: 75 },
    { type: BadgeType.WORKOUTS_100, min: 100 },
    { type: BadgeType.WORKOUTS_150, min: 150 },
    { type: BadgeType.WORKOUTS_200, min: 200 },
    { type: BadgeType.WORKOUTS_300, min: 300 },
    { type: BadgeType.WORKOUTS_400, min: 400 },
    { type: BadgeType.WORKOUTS_500, min: 500 },
    { type: BadgeType.WORKOUTS_600, min: 600 },
    { type: BadgeType.WORKOUTS_750, min: 750 },
    { type: BadgeType.WORKOUTS_1000, min: 1000 },
];

export const TOTAL_HOURS_THRESHOLDS: Array<{ type: BadgeType; minHours: number }> = [
    { type: BadgeType.TOTAL_5_HOURS, minHours: 5 },
    { type: BadgeType.TOTAL_10_HOURS, minHours: 10 },
    { type: BadgeType.TOTAL_15_HOURS, minHours: 15 },
    { type: BadgeType.TOTAL_20_HOURS, minHours: 20 },
    { type: BadgeType.TOTAL_25_HOURS, minHours: 25 },
    { type: BadgeType.TOTAL_50_HOURS, minHours: 50 },
    { type: BadgeType.TOTAL_75_HOURS, minHours: 75 },
    { type: BadgeType.TOTAL_100_HOURS, minHours: 100 },
    { type: BadgeType.TOTAL_150_HOURS, minHours: 150 },
    { type: BadgeType.TOTAL_200_HOURS, minHours: 200 },
    { type: BadgeType.TOTAL_300_HOURS, minHours: 300 },
    { type: BadgeType.TOTAL_500_HOURS, minHours: 500 },
    { type: BadgeType.TOTAL_1000_HOURS, minHours: 1000 },
];

export const STREAK_THRESHOLDS: Array<{ type: BadgeType; min: number }> = [
    { type: BadgeType.STREAK_2, min: 2 },
    { type: BadgeType.STREAK_3, min: 3 },
    { type: BadgeType.STREAK_7, min: 7 },
];

export const VOLUME_THRESHOLDS: Array<{ type: BadgeType; min: number }> = [
    { type: BadgeType.VOLUME_1000, min: 1000 },
    { type: BadgeType.VOLUME_5000, min: 5000 },
    { type: BadgeType.VOLUME_10K, min: 10000 },
    { type: BadgeType.VOLUME_25k, min: 25000 },
    { type: BadgeType.VOLUME_50k, min: 50000 },
    { type: BadgeType.VOLUME_75k, min: 75000 },
    { type: BadgeType.VOLUME_100k, min: 100000 },
    { type: BadgeType.VOLUME_250k, min: 250000 },
    { type: BadgeType.VOLUME_500k, min: 500000 },
    { type: BadgeType.VOLUME_1M, min: 1000000 },
];