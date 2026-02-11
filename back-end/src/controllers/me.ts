import type { Request, Response } from "express";
import { meService } from "../services/me";

export async function meController(req: Request, res: Response) {
    const user = (req as any).user;

    const result = await meService(user);

    if (!result) {
        return res.status(401).json({ message: "Invalid or expired access token." });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}/uploads/avatars`;

    const avatarUrl = result.avatarFileName
        ? `${baseUrl}/${result.avatarFileName}`
        : `${baseUrl}/default-avatar.webp`;

    return res.status(200).json({
        id: result.id,
        username: result.username,
        fitnessGoal: result.fitnessGoal,
        exper: result.experienceLevel,
        experienceLevel: result.experienceLevel,
        trainingStyle: result.trainingStyle,
        trainingFrequency: result.trainingFrequency,
        weight: result.weight,
        age: result.age,
        heightUnitType: result.heightUnitType,
        weightUnitType: result.weightUnitType,
        avatarUrl,
    });
}
