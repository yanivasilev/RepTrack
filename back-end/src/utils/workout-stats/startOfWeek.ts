import { startOfDay } from "./startOfDay";

export function startOfWeek(d: Date) {
    const x = startOfDay(d);
    const dow = (x.getDay() + 6) % 7;
    return new Date(x.getTime() - dow * 24 * 60 * 60 * 1000);
}