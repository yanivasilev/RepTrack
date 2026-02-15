import type { Request, Response } from "express";
import { deleteWorkoutExerciseService } from "../../services/exercises/delete-workout-exercise";

export async function deleteWorkoutExerciseController(req: Request, res: Response) {
    const user = (req as any).user;
    const workoutExerciseId = Number(req.params.workoutExerciseId);

    if (!Number.isInteger(workoutExerciseId) || workoutExerciseId <= 0) {
        return res.status(400).json({ message: "Invalid exercise id." });
    }

    const result = await deleteWorkoutExerciseService(user.id, workoutExerciseId);

    if (result.status === "not_found") return res.status(404).json({ message: "Exercise not found in this workout." });
    if (result.status === "unauthorised") return res.status(403).json({ message: "This workout is not yours." });
    if (result.status === "workout_not_active") return res.status(409).json({ message: "This workout is not active." });

    return res.status(200).json({ message: "Exercise deleted." });
}
