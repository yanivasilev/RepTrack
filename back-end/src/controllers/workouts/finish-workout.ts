import type { Request, Response } from "express";
import { finishWorkoutService } from "../../services/workouts/finish-workout";
import { finishWorkoutSchema } from "../../schemas/workouts/finish-workout";

export async function finishWorkoutController(req: Request, res: Response) {
    const user = (req as any).user;
    const workoutId = Number(req.params.workoutId);

    if (!Number.isInteger(workoutId) || workoutId <= 0) return res.status(400).json({ message: "Invalid workout id." });

    const parsed = finishWorkoutSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        });
    }

    const result = await finishWorkoutService(user.id, workoutId, parsed.data);

    if (result.status === "not_found") return res.status(404).json({ message: "Workout not found." });
    if (result.status === "unauthorised") return res.status(403).json({ message: "Not allowed." });
    if (result.status === "already_finished") return res.status(400).json({ message: "Workout already finished." });
    if (result.status === "invalid_time") return res.status(400).json({ message: "endedAt cannot be before startedAt." });

    return res.status(200).json({
        message: "Workout finished.",
        workout: result.workout,
    });
}
