export type Suggestion = {
    action: "increase" | "maintain";
    suggestedValue: number;
    delta: number;
    message: string;
};