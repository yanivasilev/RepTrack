"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.labelForDay = labelForDay;
function labelForDay(d) {
    return d.toLocaleDateString("en-GB", { weekday: "short" });
}
