import { addDays } from "./addDays";
import { dayKey } from "./dayKey";
import { labelFor30Days } from "./labelFor30Days";
import { labelForDay } from "./labelForDay";
import { startOfDay } from "./startOfDay";
import { toEpochSeconds } from "./toEpochSeconds";
import { Point } from "./types/Point";

export function buildDayPoints(now: Date, days: number): Point[] {
    const end = startOfDay(now);
    const start = addDays(end, -(days - 1));
    const pts: Point[] = [];
    let cur = start;

    let prev: Date | undefined = undefined;

    while (cur.getTime() <= end.getTime()) {
        const label = days <= 7 ? labelForDay(cur) : labelFor30Days(cur, prev);

        pts.push({
            t: dayKey(cur),
            ts: toEpochSeconds(cur),
            label,
            value: 0,
        });

        prev = cur;
        cur = addDays(cur, 1);
    }
    return pts;
}