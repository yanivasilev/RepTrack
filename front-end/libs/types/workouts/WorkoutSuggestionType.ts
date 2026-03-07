export type WorkoutSuggestionType = {
    action: "increase" | "maintain";
    suggestedValue: number;
    delta: number;
    message: string;
} 