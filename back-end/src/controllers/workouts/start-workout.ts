import type { Request, Response } from "express";
import { startWorkoutSchema } from "../../schemas/workouts/start-workout";
import { startWorkoutService } from "../../services/workouts/start-workout";

export async function startWorkoutController(req: Request, res: Response) {
    const user = (req as any).user;

    const parsed = startWorkoutSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        });
    }

    const result = await startWorkoutService(user.id, parsed.data);


    if (result.status === "active_workout_exists") return res.status(409).json({ message: "Only 1 active workout session is allowed at a time." });

    return res.status(201).json({ message: "Workout started.", workout: result.workout });
}
