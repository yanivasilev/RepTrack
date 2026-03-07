"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexPoints = indexPoints;
function indexPoints(points) {
    const m = new Map();
    points.forEach((p, i) => m.set(p.t, i));
    return m;
}
