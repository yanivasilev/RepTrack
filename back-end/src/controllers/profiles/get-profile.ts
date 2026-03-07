import type { Request, Response } from "express";
import { getProfileService } from "../../services/profiles/get-profile";

export async function getProfileController(req: Request, res: Response) {
    const user = (req as any).user;

    const result = await getProfileService(user.id);

    if (result.status === "not_found") return res.status(404).json({ message: "User not found." });

    return res.status(200).json(result);
}
