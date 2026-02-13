import { UnitType } from "../../libs/catalogs/register";

export function validateWeight(weight: number | null, unitType: UnitType | null): string | null {
    if (!weight) return "Weight is required";
    if (Number.isNaN(weight)) return "Weight must be a number.";
    if (!Number.isInteger(weight)) return "Weight must be a whole number.";

    const weightInKg = unitType === "IMPERIAL" ? Math.round(weight * 0.453592) : weight;

    if (weightInKg < 20) return "Weight looks too small.";
    if (weightInKg > 635) return "Weight looks too large.";

    return null;
}