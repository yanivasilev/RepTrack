"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bestStreak = bestStreak;
function bestStreak(workoutDayKeys) {
    const sorted = Array.from(workoutDayKeys).sort();
    let best = 0;
    let current = 0;
    let prev = null;
    for (const k of sorted) {
        const [y, m, d] = k.split("-").map(Number);
        const dt = new Date(y, m - 1, d);
        if (!prev) {
            current = 1;
        }
        else {
            const diffDays = Math.round((dt.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000));
            current = diffDays === 1 ? current + 1 : 1;
        }
        best = Math.max(best, current);
        prev = dt;
    }
    return best;
}
