import { addDays } from "./addDays";

export function addWeeks(d: Date, n: number) {
    return addDays(d, n * 7);
}