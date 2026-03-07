"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startOfWeek = startOfWeek;
const startOfDay_1 = require("./startOfDay");
function startOfWeek(d) {
    const x = (0, startOfDay_1.startOfDay)(d);
    const dow = (x.getDay() + 6) % 7;
    return new Date(x.getTime() - dow * 24 * 60 * 60 * 1000);
}
