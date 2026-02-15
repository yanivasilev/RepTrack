import type { Request, Response } from "express";
import { updateWorkoutExerciseSchema } from "../../schemas/exercises/update-workout-exercise";
import { updateWorkoutExerciseService } from "../../services/exercises/update-workout-exercise";

export async function updateWorkoutExerciseController(req: Request, res: Response) {
    const user = (req as any).user;
    const workoutExerciseId = Number(req.params.workoutExerciseId);

    if (!Number.isInteger(workoutExerciseId) || workoutExerciseId <= 0) return res.status(400).json({ message: "Invalid workoutExercise id." });

    const parsed = updateWorkoutExerciseSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const result = await updateWorkoutExerciseService(user.id, workoutExerciseId, parsed.data);

    if (result.status === "not_found") return res.status(404).json({ message: "Workout exercise not found." });
    if (result.status === "exercise_not_found") return res.status(404).json({ message: "Exercise not found." });
    if (result.status === "unauthorised") return res.status(403).json({ message: "This workout is not yours." });
    if (result.status === "workout_not_active") return res.status(409).json({ message: "This workout is not active." });
    if (result.status === "no_changes") return res.status(400).json({ message: "No changes detected." });

    return res.status(200).json({
        message: "Exercise updated.",
        workoutExercise: result.workoutExercise,
    });
}
