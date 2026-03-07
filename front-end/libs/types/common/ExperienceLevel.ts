export const EXPERIENCE_LEVEL = [
    { label: "BEGINNER", value: "BEGINNER" },
    { label: "INTERMEDIATE", value: "INTERMEDIATE" },
    { label: "ADVANCED", value: "ADVANCED" },
] as const;

export type ExperienceLevel = typeof EXPERIENCE_LEVEL[number]["value"];