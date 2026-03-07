import { ExerciseType } from "../types/common/exercises/ExerciseType";
import { UnitType } from "../types/common/UnitType";
import { convertWeight } from "./convertWeight";
import { WorkoutSuggestionType } from "../types/workouts/WorkoutSuggestionType";
import { formatSeconds } from "./time/formatSeconds";

export function formatSuggestionValues(suggestion: WorkoutSuggestionType, exerciseType: ExerciseType, weightUnitType: UnitType) {
    if (exerciseType === "TIMED") {
        const nextDuration = formatSeconds(Math.round(suggestion.suggestedValue));
        const delta = Math.round(suggestion.delta);
        const deltaPrefix = suggestion.action === "increase" ? "+" : "";
        const deltaText = suggestion.action === "increase" ? "Increase" : "Decrease";

        return `Try: ${nextDuration} (${deltaText} ${deltaPrefix}${delta}s)`;
    }

    const unitLabel = weightUnitType === "IMPERIAL" ? "LB" : "KG";
    const displaySuggestedWeight = weightUnitType === "IMPERIAL"
        ? convertWeight(suggestion.suggestedValue, "METRIC", "IMPERIAL")
        : suggestion.suggestedValue;
    const displayDeltaWeight = weightUnitType === "IMPERIAL"
        ? convertWeight(suggestion.delta, "METRIC", "IMPERIAL")
        : suggestion.delta;

    const nextWeight = Number(displaySuggestedWeight.toFixed(2));
    const delta = Number(displayDeltaWeight.toFixed(2));
    const deltaPrefix = suggestion.action === "increase" ? "+" : "";
    const deltaText = suggestion.action === "increase" ? "Increase" : "Decrease";

    return `Try ${nextWeight}${unitLabel} (${deltaText} ${deltaPrefix}${delta}${unitLabel})`;
};