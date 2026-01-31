import { trackers } from "./emailLimiter";

export function emailLimiterCleanup() {
    setInterval(() => {
        const now = Date.now();

        for (const [k, v] of trackers.entries()) {

            if (v.resetAt <= now) {
                trackers.delete(k);
            }
        }

    }, 60_000).unref?.();
}