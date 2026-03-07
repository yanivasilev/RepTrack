"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentStreak = currentStreak;
const startOfDay_1 = require("../workout-tracking-charts/startOfDay");
const dayKey_1 = require("./dayKey");
function currentStreak(workoutDayKeys, now = new Date()) {
    let streak = 0;
    let cursor = (0, startOfDay_1.startOfDay)(now);
    while (true) {
        const key = (0, dayKey_1.dayKey)(cursor);
        if (!workoutDayKeys.has(key))
            break;
        streak += 1;
        cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000);
    }
    return streak;
}
