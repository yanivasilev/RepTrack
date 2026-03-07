"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailLimiterCleanup = emailLimiterCleanup;
const emailLimiter_1 = require("./emailLimiter");
function emailLimiterCleanup() {
    setInterval(() => {
        const now = Date.now();
        for (const [k, v] of emailLimiter_1.trackers.entries()) {
            if (v.resetAt <= now) {
                emailLimiter_1.trackers.delete(k);
            }
        }
    }, 60000).unref?.();
}
