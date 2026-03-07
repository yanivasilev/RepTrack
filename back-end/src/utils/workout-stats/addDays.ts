export function addDays(d: Date, n: number) {
    return new Date(d.getTime() + n * 24 * 60 * 60 * 1000);
}