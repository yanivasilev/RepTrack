export const UNIT_TYPE = [
    { labelHeight: "CM", labelWeight: "KG", value: "METRIC" },
    { labelHeight: "FT", labelWeight: "LB", value: "IMPERIAL" },
] as const;

export type UnitType = typeof UNIT_TYPE[number]["value"];