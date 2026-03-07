import { submitForm } from "../../../forms/submitForm";
import { validateDurationSeconds } from "../../../forms/validations/start-workout/validateDurationSeconds";
import { validateReps } from "../../../forms/validations/start-workout/validateReps";
import { validateWeight } from "../../../forms/validations/start-workout/validateWeight";
import { saveWorkoutApi } from "../../../services/api/workouts/saveWorkoutApi";
import { SaveWorkoutType } from "../../../libs/types/workouts/workout-start/saveWorkoutType";
import { ApiSuccessWorkout } from "../../../libs/types/api-responds/ApiSuccessWorkout";

type Fields = string;

const setErrors = (
    exerciseIndex: number,
    setIndex: number,
    field: "reps" | "weight" | "durationSeconds"
) => `exercises.${exerciseIndex}.sets.${setIndex}.${field}`;

export async function SubmitWorkoutStart({ data }: { data: SaveWorkoutType }) {
    return submitForm<SaveWorkoutType, Fields, ApiSuccessWorkout>({
        data,
        validate: (d) => {
            const errors: Record<string, string> = {};

            d.exercises.forEach((exercise, exerciseIndex) => {
                exercise.sets.forEach((set, setIndex) => {
                    const weightError = validateWeight(set.weight);
                    if (weightError) errors[setErrors(exerciseIndex, setIndex, "weight")] = weightError;

                    if (exercise.exerciseType === "REPS") {
                        const repsError = validateReps(set.reps);
                        if (repsError) errors[setErrors(exerciseIndex, setIndex, "reps")] = repsError;

                    } else if (exercise.exerciseType === "TIMED") {
                        const durationSecondsError = validateDurationSeconds(set.durationSeconds);
                        if (durationSecondsError) errors[setErrors(exerciseIndex, setIndex, "durationSeconds")] = durationSecondsError;
                    }
                });
            });

            return Object.keys(errors).length ? errors : null;
        },
        apiCall: saveWorkoutApi,
        successMessage: (res) => res.message ?? "Workout saved.",
        fallbackErrorMessage: "Save workout failed.",
    });
}
