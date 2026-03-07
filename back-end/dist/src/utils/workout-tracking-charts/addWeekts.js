"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWeeks = addWeeks;
const addDays_1 = require("./addDays");
function addWeeks(d, n) {
    return (0, addDays_1.addDays)(d, n * 7);
}
