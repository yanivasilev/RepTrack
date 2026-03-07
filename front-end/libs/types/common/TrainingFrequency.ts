export const TRAINING_FREQUENCY = [
    { label: "1-2\nDAYS", value: "ONE_TO_TWO_DAYS" },
    { label: "3-4\nDAYS", value: "THREE_TO_FOUR_DAYS" },
    { label: "5+\nDAYS", value: "FIVE_PLUS_DAYS" },
] as const;

export type TrainingFrequency = typeof TRAINING_FREQUENCY[number]["value"];
