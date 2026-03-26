export function angleBetweenPoints(a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }) {
    // ANGLE AT POINT "B" IS FORMED BY "BA" AND "BC", RETURNED IN DEGREES
    const abx = a.x - b.x, aby = a.y - b.y;
    const cbx = c.x - b.x, cby = c.y - b.y;

    const dot = abx * cbx + aby * cby;
    const magAB = Math.hypot(abx, aby);
    const magCB = Math.hypot(cbx, cby);

    // CLAMP COSINE TO [-1, 1] AND ADD EPSILON TO AVOID NaN FROM FLOATING POINT EDGE CASES
    const cos = dot / (magAB * magCB + 1e-9);
    const rad = Math.acos(Math.max(-1, Math.min(1, cos)));
    return (rad * 180) / Math.PI;
}