import { UnitType } from "../types/common/UnitType";

const KG_TO_LB = 2.2046226218;
const LB_TO_KG = 0.45359237;

export function convertWeightToString(weight: string, from: UnitType | null, to: UnitType | null): string {
    if (!weight) return weight;
    if (!from || !to) return weight;
    if (from === to) return weight;


    const weightToNumber = Number(weight);
    if (Number.isNaN(weightToNumber)) return weight;

    let converted = weightToNumber;

    if (from === "METRIC" && to === "IMPERIAL") {
        converted = weightToNumber * KG_TO_LB;
    } else if (from === "IMPERIAL" && to === "METRIC") {
        converted = weightToNumber * LB_TO_KG;
    }

    return String(Math.round(converted)); // whole number version
}
