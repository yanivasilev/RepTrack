import type { Request, Response } from "express";
import { getWorkoutService } from "../../services/workouts/get-workout";
import { workoutIdSchema } from "../../schemas/workouts/workout-id";

export async function getWorkoutController(req: Request, res: Response) {
    const user = (req as any).user;
    const parsed = workoutIdSchema.safeParse(req.params);

    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const { workoutId } = parsed.data;

    const result = await getWorkoutService(user.id, workoutId);

    if (result.status === "not_found") return res.status(404).json({ message: "Workout not found." });
    if (result.status === "unauthorised") return res.status(403).json({ message: "The workout is not yours." });

    return res.status(200).json({ workout: result.workout });
}
