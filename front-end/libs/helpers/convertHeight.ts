import { UnitType } from "../catalogs/register";

const M_TO_FT = 3.280839895;
const FT_TO_M = 0.3048;

export function convertHeightString(height: string, from: UnitType | null, to: UnitType | null): string {
    if (!height) return height;
    if (!from || !to) return height;
    if (from === to) return height;

    const n = Number(height);
    if (Number.isNaN(n)) return height;

    let converted = n;

    if (from === "METRIC" && to === "IMPERIAL") {
        converted = n * M_TO_FT;
    } else if (from === "IMPERIAL" && to === "METRIC") {
        converted = n * FT_TO_M;
    }

    return String(Number(converted.toFixed(2)));
}
