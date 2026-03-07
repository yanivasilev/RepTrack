"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDays = addDays;
function addDays(d, n) {
    return new Date(d.getTime() + n * 24 * 60 * 60 * 1000);
}
