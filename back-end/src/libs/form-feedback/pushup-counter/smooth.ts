export function smooth(prev: number | null, next: number, alpha: number) {
    return prev == null ? next : prev * alpha + next * (1 - alpha);
}