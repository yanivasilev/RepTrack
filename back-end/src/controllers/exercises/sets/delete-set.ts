import type { Request, Response } from "express";
import { deleteSetService } from "../../../services/exercises/sets/delete-set";

export async function deleteSetController(req: Request, res: Response) {
    const user = (req as any).user;
    const setId = Number(req.params.setId);

    if (!Number.isInteger(setId) || setId <= 0) return res.status(400).json({ message: "Invalid set id." });

    const result = await deleteSetService(user.id, setId);

    if (result.status === "not_found") return res.status(404).json({ message: "Set not found." });
    if (result.status === "unauthorised") return res.status(403).json({ message: "This workout is not yours." });
    if (result.status === "workout_not_active") return res.status(409).json({ message: "This workout is not active." });

    return res.status(200).json({ message: "Set deleted." });
}
