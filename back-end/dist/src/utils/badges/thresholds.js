"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VOLUME_THRESHOLDS = exports.STREAK_THRESHOLDS = exports.TOTAL_HOURS_THRESHOLDS = exports.WORKOUT_THRESHOLDS = void 0;
const enums_1 = require("../../../generated/prisma/enums");
exports.WORKOUT_THRESHOLDS = [
    { type: enums_1.BadgeType.FIRST_WORKOUT, min: 1 },
    { type: enums_1.BadgeType.WORKOUTS_5, min: 5 },
    { type: enums_1.BadgeType.WORKOUTS_15, min: 15 },
    { type: enums_1.BadgeType.WORKOUTS_20, min: 20 },
    { type: enums_1.BadgeType.WORKOUTS_25, min: 25 },
    { type: enums_1.BadgeType.WORKOUTS_50, min: 50 },
    { type: enums_1.BadgeType.WORKOUTS_75, min: 75 },
    { type: enums_1.BadgeType.WORKOUTS_100, min: 100 },
    { type: enums_1.BadgeType.WORKOUTS_150, min: 150 },
    { type: enums_1.BadgeType.WORKOUTS_200, min: 200 },
    { type: enums_1.BadgeType.WORKOUTS_300, min: 300 },
    { type: enums_1.BadgeType.WORKOUTS_400, min: 400 },
    { type: enums_1.BadgeType.WORKOUTS_500, min: 500 },
    { type: enums_1.BadgeType.WORKOUTS_600, min: 600 },
    { type: enums_1.BadgeType.WORKOUTS_750, min: 750 },
    { type: enums_1.BadgeType.WORKOUTS_1000, min: 1000 },
];
exports.TOTAL_HOURS_THRESHOLDS = [
    { type: enums_1.BadgeType.TOTAL_5_HOURS, minHours: 5 },
    { type: enums_1.BadgeType.TOTAL_10_HOURS, minHours: 10 },
    { type: enums_1.BadgeType.TOTAL_15_HOURS, minHours: 15 },
    { type: enums_1.BadgeType.TOTAL_20_HOURS, minHours: 20 },
    { type: enums_1.BadgeType.TOTAL_25_HOURS, minHours: 25 },
    { type: enums_1.BadgeType.TOTAL_50_HOURS, minHours: 50 },
    { type: enums_1.BadgeType.TOTAL_75_HOURS, minHours: 75 },
    { type: enums_1.BadgeType.TOTAL_100_HOURS, minHours: 100 },
    { type: enums_1.BadgeType.TOTAL_150_HOURS, minHours: 150 },
    { type: enums_1.BadgeType.TOTAL_200_HOURS, minHours: 200 },
    { type: enums_1.BadgeType.TOTAL_300_HOURS, minHours: 300 },
    { type: enums_1.BadgeType.TOTAL_500_HOURS, minHours: 500 },
    { type: enums_1.BadgeType.TOTAL_1000_HOURS, minHours: 1000 },
];
exports.STREAK_THRESHOLDS = [
    { type: enums_1.BadgeType.STREAK_2, min: 2 },
    { type: enums_1.BadgeType.STREAK_3, min: 3 },
    { type: enums_1.BadgeType.STREAK_7, min: 7 },
];
exports.VOLUME_THRESHOLDS = [
    { type: enums_1.BadgeType.VOLUME_1000, min: 1000 },
    { type: enums_1.BadgeType.VOLUME_5000, min: 5000 },
    { type: enums_1.BadgeType.VOLUME_10K, min: 10000 },
    { type: enums_1.BadgeType.VOLUME_25k, min: 25000 },
    { type: enums_1.BadgeType.VOLUME_50k, min: 50000 },
    { type: enums_1.BadgeType.VOLUME_75k, min: 75000 },
    { type: enums_1.BadgeType.VOLUME_100k, min: 100000 },
    { type: enums_1.BadgeType.VOLUME_250k, min: 250000 },
    { type: enums_1.BadgeType.VOLUME_500k, min: 500000 },
    { type: enums_1.BadgeType.VOLUME_1M, min: 1000000 },
];
