import type { Request, Response } from "express";
import { getExerciseSchema } from "../../schemas/exercises/get-exercise";
import { getExerciseService } from "../../services/exercises/get-exercise";

export async function getExerciseController(req: Request, res: Response) {
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

    const result = await getExerciseService(exerciseId);

    if (result.status === "not_found") return res.status(404).json({ message: "Exercise not found." });

    return res.status(200).json(result);
}
