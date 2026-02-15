import type { Request, Response } from "express";
import { updateSetSchema } from "../../../schemas/exercises/sets/update-set";
import { updateSetService } from "../../../services/exercises/sets/update-set";

export async function updateSetController(req: Request, res: Response) {
    const user = (req as any).user;
    const setId = Number(req.params.setId);

    if (!Number.isInteger(setId) || setId <= 0) {
        return res.status(400).json({ message: "Invalid set id." });
    }

    const parsed = updateSetSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const result = await updateSetService(user.id, setId, parsed.data);

    if (result.status === "not_found") return res.status(404).json({ message: "Set not found." });
    if (result.status === "unauthorised") return res.status(403).json({ message: "This workout is not yours." });
    if (result.status === "workout_not_active") return res.status(409).json({ message: "This workout is not active." });
    if (result.status === "no_changes") return res.status(400).json({ message: "No changes detected." });
    if (result.status === "set_number_taken") return res.status(400).json({ message: "Set number already exists for this exercise." });
    if (result.status === "invalid_set") {
        return res.status(400).json({
            errors: result.errors.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    return res.status(200).json({
        message: "Set updated.",
        set: result.set,
    });
}
