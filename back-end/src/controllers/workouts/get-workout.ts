import type { Request, Response } from "express";
import { getWorkoutService } from "../../services/workouts/get-workout";

export async function getWorkoutController(req: Request, res: Response) {
    const user = (req as any).user;
    const workoutId = Number(req.params.workoutId);

    if (!Number.isInteger(workoutId) || workoutId <= 0) return res.status(400).json({ message: "Invalid workout id." });

    const result = await getWorkoutService(user.id, workoutId);

    if (result.status === "not_found") return res.status(404).json({ message: "Workout not found." });
    if (result.status === "unauthorised") return res.status(403).json({ message: "Not allowed." });

    return res.status(200).json({ workout: result.workout });
}
