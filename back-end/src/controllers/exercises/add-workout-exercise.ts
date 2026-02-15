import type { Request, Response } from "express";
import { addWorkoutExerciseService } from "../../services/exercises/add-workout-exercise";
import { addWorkoutExerciseSchema } from "../../schemas/exercises/add-workout-exercise";

export async function addWorkoutExerciseController(req: Request, res: Response) {
    const user = (req as any).user;
    const workoutId = Number(req.params.workoutId);

    if (!Number.isInteger(workoutId) || workoutId <= 0) {
        return res.status(400).json({ message: "Invalid workout id." });
    }

    const parsed = addWorkoutExerciseSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const result = await addWorkoutExerciseService(user.id, workoutId, parsed.data);

    if (result.status === "workout_not_found") return res.status(404).json({ message: "Workout not found." });
    if (result.status === "unauthorised") return res.status(403).json({ message: "This workout is not yours." });
    if (result.status === "workout_not_active") return res.status(403).json({ message: "This workout is not active." });
    if (result.status === "exercise_not_found") return res.status(404).json({ message: "Exercise not found." });

    return res.status(201).json({
        message: "Exercise added.",
        workoutExercise: result.workoutExercise,
    });
}
