"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEpochSeconds = toEpochSeconds;
function toEpochSeconds(d) {
    return Math.floor(d.getTime() / 1000);
}
