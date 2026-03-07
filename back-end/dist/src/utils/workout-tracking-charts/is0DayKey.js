"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.is0DayKey = is0DayKey;
function is0DayKey(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}
