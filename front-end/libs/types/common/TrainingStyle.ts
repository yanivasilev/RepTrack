export const TRAINING_STYLE = [
    { label: "WEIGHT\nLIFTING", value: "WEIGHT_LIFTING" },
    { label: "POWER\nLIFTING", value: "POWER_LIFTING" },
    { label: "BODY\nBUILDING", value: "BODY_BUILDING" },
    { label: "BODYWEIGHT\nTRAINING", value: "BODYWEIGHT_TRAINING" },
    { label: "HOME\nWORKOUTS", value: "HOME_WORKOUTS" },
] as const;

export type TrainingStyle = typeof TRAINING_STYLE[number]["value"];
