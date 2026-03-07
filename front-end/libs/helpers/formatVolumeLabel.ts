import { UnitType } from "../types/common/UnitType";
import { convertWeight } from "./convertWeight";

export function formatVolumeLabel(weight: number, unit: UnitType) {
    const raw = unit === "IMPERIAL" ? convertWeight(weight, "METRIC", "IMPERIAL") : weight;
    const exact = Math.round(raw);
    const unitLabel = unit === "IMPERIAL" ? "lb" : "kg";

    const compact =
        exact >= 1_000_000
            ? `${(exact / 1_000_000).toFixed(1)}M`
            : exact >= 1_000
                ? `${(exact / 1_000).toFixed(1)}k`
                : `${exact}`;

    return {
        compact: `${compact} ${unitLabel}`,
        exact: `${exact.toLocaleString("en-US")} ${unitLabel}`,
    };
}