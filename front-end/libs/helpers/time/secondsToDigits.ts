// STORES INPUT BACK TO DIGITS
export function secondsToDigits(totalSeconds: number) {
    const s = Math.max(0, Math.floor(totalSeconds));
    const hh = Math.floor(s / 3600);
    const mm = Math.floor((s % 3600) / 60);
    const ss = s % 60;

    if (hh > 0) return `${hh}${String(mm).padStart(2, "0")}${String(ss).padStart(2, "0")}`; // hhmmss
    return `${mm}${String(ss).padStart(2, "0")}`; // mmss (e.g. 90s => 130)
}