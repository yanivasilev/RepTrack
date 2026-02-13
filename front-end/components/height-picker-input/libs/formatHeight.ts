import { UnitType } from "../../../libs/catalogs/register";
import { cmToFt } from "./cmToFt";

export function formatHeight(cm: number, unit: UnitType | null) {
    if (unit === "IMPERIAL") {
        const { ft, inch } = cmToFt(cm);
        return `${ft}' ${inch}"`;
    }
    return `${cm} cm`;
}