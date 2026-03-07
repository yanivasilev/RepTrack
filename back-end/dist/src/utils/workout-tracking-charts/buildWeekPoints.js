"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWeekPoints = buildWeekPoints;
const startOfDay_1 = require("./startOfDay");
const addWeekts_1 = require("./addWeekts");
const toEpochSeconds_1 = require("./toEpochSeconds");
const is0DayKey_1 = require("./is0DayKey");
function buildWeekPoints(now, weeks, labelEveryWeeks) {
    const end = (0, startOfDay_1.startOfDay)(now);
    const start = (0, addWeekts_1.addWeeks)(end, -(weeks - 1));
    const pts = [];
    let cur = start;
    let i = 0;
    while (cur.getTime() <= end.getTime()) {
        const isFirst = i === 0;
        const isLast = i === weeks - 1;
        const show = isFirst || isLast || (i % labelEveryWeeks === 0);
        pts.push({
            t: (0, is0DayKey_1.is0DayKey)(cur),
            ts: (0, toEpochSeconds_1.toEpochSeconds)(cur),
            label: show ? cur.toLocaleDateString("en-GB", { month: "short" }) : "",
            value: 0,
        });
        cur = (0, addWeekts_1.addWeeks)(cur, 1);
        i += 1;
    }
    return pts;
}
