export const FITNESS_GOALS = [
    { label: "GAIN\nSTRENGTH", value: "GAIN_STRENGTH" },
    { label: "IMPROVE\nTECHNIQUE", value: "IMPROVE_TECHNIQUE" },
    { label: "GENERAL\nFITNESS", value: "GENERAL_FITNESS" },
    { label: "BUILD\nMUSCLE", value: "BUILD_MUSCLE" },
    { label: "LOSE\nWEIGHT", value: "LOSE_WEIGHT" },
] as const;

export type FitnessGoal = typeof FITNESS_GOALS[number]["value"];

export const EXPERIENCE_LEVEL = [
    { label: "BEGINNER", value: "BEGINNER" },
    { label: "INTERMEDIATE", value: "INTERMEDIATE" },
    { label: "ADVANCED", value: "ADVANCED" },
] as const;

export type ExperienceLevel = typeof EXPERIENCE_LEVEL[number]["value"];

export const TRAINING_STYLE = [
    { label: "WEIGHT\nLIFTING", value: "WEIGHT_LIFTING" },
    { label: "POWER\nLIFTING", value: "POWER_LIFTING" },
    { label: "BODY\nBUILDING", value: "BODY_BUILDING" },
    { label: "BODYWEIGHT\nTRAINING", value: "BODYWEIGHT_TRAINING" },
    { label: "HOME\nWORKOUTS", value: "HOME_WORKOUTS" },
] as const;

export type TrainingStyle = typeof TRAINING_STYLE[number]["value"];

export const TRAINING_FREQUENCY = [
    { label: "1-2\nDAYS", value: "ONE_TO_TWO_DAYS" },
    { label: "2-3\nDAYS", value: "TWO_TO_THREE_DAYS" },
    { label: "5+\nDAYS", value: "FIVE_PLUS_DAYS" },
] as const;

export type TrainingFrequency = typeof TRAINING_FREQUENCY[number]["value"];

export const UNIT_TYPE = [
    { labelHeight: "CM", labelWeight: "KG", value: "METRIC" },
    { labelHeight: "FT", labelWeight: "LB", value: "IMPERIAL" },
] as const;

export type UnitType = typeof UNIT_TYPE[number]["value"];