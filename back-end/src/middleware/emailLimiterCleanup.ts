import { trackers } from "./emailLimiter";

// CLEANS EMAIL LIMITER ATTEMPTS IF ANYTHING IS EXPIRED
export function emailLimiterCleanup() {
    setInterval(() => {
        const now = Date.now();

        // GOES THROUGH ALL EMAIL LIMITED ATTEMPTS
        for (const [k, v] of trackers.entries()) {
            // DELETES EXPIRED ATTEMPTS
            if (v.resetAt <= now) trackers.delete(k);
        }

        // CLEAN UP IS RAN EVERY 60 SECONDS
    }, 60_000).unref?.();
}