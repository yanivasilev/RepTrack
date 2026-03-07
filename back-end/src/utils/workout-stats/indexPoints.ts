import { Point } from "./types/Point";

export function indexPoints(points: Point[]) {
    const m = new Map<string, number>();
    points.forEach((p, i) => m.set(p.t, i));
    return m;
}