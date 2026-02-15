import type { Request, Response } from "express";
import { addSetSchema } from "../../../schemas/exercises/sets/add-set";
import { addSetService } from "../../../services/exercises/sets/add-set";

export async function addSetController(req: Request, res: Response) {
    const user = (req as any).user;
    const workoutExerciseId = Number(req.params.workoutExerciseId);

    if (!Number.isInteger(workoutExerciseId) || workoutExerciseId <= 0) return res.status(400).json({ message: "Invalid workoutExercise id." });

    const parsed = addSetSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const result = await addSetService(user.id, workoutExerciseId, parsed.data);

    if (result.status === "workout_exercise_not_found") return res.status(404).json({ message: "Workout exercise not found." });
    if (result.status === "unauthorised") return res.status(403).json({ message: "This workout is not yours." });
    if (result.status === "workout_not_active") return res.status(409).json({ message: "This workout is not active." });
    if (result.status === "set_number_taken") return res.status(400).json({ message: "setNumber already exists for this exercise." });

    return res.status(201).json({
        message: "Set added.",
        set: result.set,
    });
}
