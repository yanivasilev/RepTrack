import type { Request, Response } from "express";
import { getAllExercisesSchema } from "../../schemas/exercises/get-all-exercises";
import { getAllExercisesService } from "../../services/exercises/get-all-exercises";

export async function getAllExercisesController(req: Request, res: Response) {
    const parsed = getAllExercisesSchema.safeParse(req.query);

    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const { page, limit, query } = parsed.data;

    const result = await getAllExercisesService(page, limit, query);

    return res.status(200).json(result);
}
