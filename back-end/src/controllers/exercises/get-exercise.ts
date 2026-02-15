import type { Request, Response } from "express";
import { getExerciseService } from "../../services/exercises/get-exercise";

export async function getExerciseController(req: Request, res: Response) {
    const exerciseId = Number(req.params.exerciseId);

    if (!Number.isInteger(exerciseId) || exerciseId <= 0) return res.status(400).json({ message: "Invalid exercise id." });

    const result = await getExerciseService(exerciseId);

    if (result.status === "not_found") return res.status(404).json({ message: "Exercise not found." });

    return res.status(200).json({ exercise: result.exercise });
}
