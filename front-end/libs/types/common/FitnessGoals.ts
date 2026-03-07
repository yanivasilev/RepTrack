export const FITNESS_GOALS = [
    { label: "GAIN\nSTRENGTH", value: "GAIN_STRENGTH" },
    { label: "IMPROVE\nTECHNIQUE", value: "IMPROVE_TECHNIQUE" },
    { label: "GENERAL\nFITNESS", value: "GENERAL_FITNESS" },
    { label: "BUILD\nMUSCLE", value: "BUILD_MUSCLE" },
    { label: "LOSE\nWEIGHT", value: "LOSE_WEIGHT" },
] as const;

export type FitnessGoal = typeof FITNESS_GOALS[number]["value"];
