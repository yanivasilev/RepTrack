import type { Request, Response } from "express";
import { saveWorkoutSchema } from "../../schemas/workouts/save-workout/save-workout";
import { saveWorkoutService } from "../../services/workouts/save-workout";

export async function saveWorkoutController(req: Request, res: Response) {
    const user = (req as any).user;

    const parsed = saveWorkoutSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        });
    }

    const result = await saveWorkoutService(user.id, parsed.data);

    if (result.status === "invalid_exercise_id") return res.status(400).json({ message: "Exercise not found.", missing: result.missing });
    if (result.status === "invalid_set_for_exercise_type") return res.status(400).json({ message: "Invalid sets for exercise type.", errors: result.errors });

    return res.status(201).json({ message: "Workout saved successfully.", workout: result.workout, newBadges: result.newBadges });
}
