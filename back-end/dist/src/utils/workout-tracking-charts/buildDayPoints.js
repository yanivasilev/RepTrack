"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDayPoints = buildDayPoints;
const addDays_1 = require("./addDays");
const is0DayKey_1 = require("./is0DayKey");
const labelFor30Days_1 = require("./labelFor30Days");
const labelForDay_1 = require("./labelForDay");
const startOfDay_1 = require("./startOfDay");
const toEpochSeconds_1 = require("./toEpochSeconds");
function buildDayPoints(now, days) {
    const end = (0, startOfDay_1.startOfDay)(now);
    const start = (0, addDays_1.addDays)(end, -(days - 1));
    const pts = [];
    let cur = start;
    let prev = undefined;
    while (cur.getTime() <= end.getTime()) {
        const label = days <= 7 ? (0, labelForDay_1.labelForDay)(cur) : (0, labelFor30Days_1.labelFor30Days)(cur, prev);
        pts.push({
            t: (0, is0DayKey_1.is0DayKey)(cur),
            ts: (0, toEpochSeconds_1.toEpochSeconds)(cur),
            label,
            value: 0,
        });
        prev = cur;
        cur = (0, addDays_1.addDays)(cur, 1);
    }
    return pts;
}
