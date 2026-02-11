import { FitnessGoalValue } from "../../services/api/profileDetailsApi";
import { FITNESS_GOALS } from "../catalogs/register";

export function fitnessGoalToLabel(value: FitnessGoalValue): string {
    const goal = FITNESS_GOALS.find(g => g.value === value);
    return goal ? goal.label : value;
}