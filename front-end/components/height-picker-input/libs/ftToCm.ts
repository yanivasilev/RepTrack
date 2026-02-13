export function ftToCm(ft: number, inch: number) {
    return Math.round((ft * 12 + inch) * 2.54);
}
