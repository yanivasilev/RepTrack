import { startOfDay } from "../startOfDay";
import { dayKey } from "../dayKey";

export function currentStreak(workoutDayKeys: Set<string>, now = new Date()) {
    let streak = 0;
    let cursor = startOfDay(now);

    while (true) {
        const key = dayKey(cursor);
        if (!workoutDayKeys.has(key)) break;
        streak += 1;
        cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000);
    }

    return streak;
}