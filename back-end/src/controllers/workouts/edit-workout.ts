import type { Request, Response } from "express";
import { editWorkoutSchema } from "../../schemas/workouts/edit-workout";
import { editWorkoutService } from "../../services/workouts/edit-workout";

export async function editWorkoutController(req: Request, res: Response) {
    const user = (req as any).user;
    const workoutId = Number(req.params.workoutId);

    if (!Number.isInteger(workoutId) || workoutId <= 0) return res.status(400).json({ message: "Invalid workout id." });

    const parsed = editWorkoutSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        });
    }

    const result = await editWorkoutService(user.id, workoutId, parsed.data);

    if (result.status === "not_found") return res.status(404).json({ message: "Workout not found." });
    if (result.status === "unauthorised") return res.status(403).json({ message: "Not allowed." });
    if (result.status === "no_changes") return res.status(400).json({ message: "No changes detected." });
    if (result.status === "invalid_time") return res.status(400).json({ message: "endedAt cannot be before startedAt." });

    return res.status(200).json({
        message: "Workout updated.",
        workout: result.workout,
    });
}
