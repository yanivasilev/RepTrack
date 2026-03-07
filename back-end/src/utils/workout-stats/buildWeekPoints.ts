import { startOfDay } from "./startOfDay";
import { addWeeks } from "./addWeeks";
import { toEpochSeconds } from "./toEpochSeconds";
import { Point } from "./types/Point";
import { dayKey } from "./dayKey";

export function buildWeekPoints(now: Date, weeks: number, labelEveryWeeks: number): Point[] {
    const end = startOfDay(now);
    const start = addWeeks(end, -(weeks - 1));
    const pts: Point[] = [];
    let cur = start;

    let i = 0;
    while (cur.getTime() <= end.getTime()) {
        const isFirst = i === 0;
        const isLast = i === weeks - 1;
        const show = isFirst || isLast || (i % labelEveryWeeks === 0);

        pts.push({
            t: dayKey(cur),
            ts: toEpochSeconds(cur),
            label: show ? cur.toLocaleDateString("en-GB", { month: "short" }) : "",
            value: 0,
        });

        cur = addWeeks(cur, 1);
        i += 1;
    }

    return pts;
}