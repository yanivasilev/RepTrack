import { UnitType } from "../types/common/UnitType";

const KG_TO_LB = 2.2046226218;
const LB_TO_KG = 0.45359237;

export function convertWeight(weight: number, from: UnitType, to: UnitType): number {
    if (from === to) return weight;

    if (from === "METRIC" && to === "IMPERIAL") {
        return weight * KG_TO_LB;
    }

    if (from === "IMPERIAL" && to === "METRIC") {
        return weight * LB_TO_KG;
    }

    return weight;
}