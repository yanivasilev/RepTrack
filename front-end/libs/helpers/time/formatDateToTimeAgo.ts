export function formatDateToTimeAgo(dateInput: string | number | Date): string {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    const diffMs = Date.now() - date.getTime();
    const safeMs = Math.max(0, diffMs);

    const seconds = Math.floor(safeMs / 1000);

    if (seconds < 60) return `${seconds}s`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo`;

    const years = Math.floor(days / 365);
    return `${years}y`;
}