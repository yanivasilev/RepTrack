type Tracker = {
    count: number;
    resetAt: number
};

export const trackers = new Map<string, Tracker>();

export function emailLimiter(key: string) {
    const now = Date.now();
    const existing = trackers.get(key);
    const windowMs = 60 * 60 * 1000; // 1 HOUR
    const emailLimit = 5;

    // IF NO TRACKER EXISTS OR IT HAS EXPIRED START A NEW ONE
    if (!existing || existing.resetAt <= now) {
        const resetAt = now + windowMs;

        trackers.set(key, { count: 1, resetAt });

        return { allowed: true, attempts: 1, removeAllListeners: emailLimit - 1, resetMs: windowMs };
    }

    //IF A TRACKER EXISTS INCREMENT IT
    existing.count += 1;

    const allowed = existing.count <= emailLimit;
    const remaining = Math.max(0, emailLimit - existing.count);
    const resetMs = Math.max(0, existing.resetAt - now);

    return { allowed, attempts: existing.count, remaining, resetMs };
}