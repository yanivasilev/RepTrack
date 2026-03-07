import type { Request, Response } from "express";
import { workoutSuggestionService } from "../../services/workouts/workout-suggestion";
import { getExerciseSchema } from "../../schemas/exercises/get-exercise";

export async function workoutSuggestionController(req: Request, res: Response) {
    const user = (req as any).user;
    const parsed = getExerciseSchema.safeParse(req.params);

    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const { exerciseId } = parsed.data;

    const result = await workoutSuggestionService(user.id, { exerciseId });

    if (result.status === "exercise_not_found") return res.status(404).json({ message: "Exercise not found." });

    return res.status(200).json(result.suggestion);
}
