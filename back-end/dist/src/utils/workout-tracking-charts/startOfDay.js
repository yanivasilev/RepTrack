"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startOfDay = startOfDay;
function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
