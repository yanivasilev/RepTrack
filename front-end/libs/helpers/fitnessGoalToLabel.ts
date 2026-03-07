import { FITNESS_GOALS, FitnessGoal } from "../types/common/FitnessGoals";

export function fitnessGoalToLabel(value: FitnessGoal): string {
    const goal = FITNESS_GOALS.find(g => g.value === value);
    return goal ? goal.label : value;
}