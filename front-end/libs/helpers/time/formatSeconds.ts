export function formatSeconds(seconds?: number) {
    const totalSeconds = seconds ?? 0;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours === 0 && minutes === 0) {
        return `${secs}s`;
    }

    if (hours === 0) {
        return `${minutes}m ${secs}s`;
    }

    if (minutes === 0) {
        return `${hours}h`;
    }

    return `${hours}h ${minutes}m ${secs}s`;
}
