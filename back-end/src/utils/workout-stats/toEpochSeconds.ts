export function toEpochSeconds(d: Date) {
    return Math.floor(d.getTime() / 1000);
}