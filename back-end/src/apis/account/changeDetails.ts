import type { Request, Response } from "express";
import { prisma } from "../../db";
import { getEmailFromAccessToken } from "../../services/getEmailbyAccessToken";
import { changeDetailsSchema } from "../../schemas/account/changeDetailsSchema";

export async function changeDetails(req: Request, res: Response) {
    const parsed = changeDetailsSchema.safeParse(req.body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));

        return res.status(400).json({ errors });
    }

    const data = parsed.data;

    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) return res.status(401).json("You must be logged in.");

    const accessToken = header.slice("Bearer ".length);
    const email = getEmailFromAccessToken(accessToken);

    if (!email) return res.status(401).json("Invalid or expired access token.");

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json("Invalid or expired access token.");

    // CHANGES OBJECT
    const changes: Record<string, any> = {};

    // CHECKS IF THERE WERE ANY CHANGES IF SO MAKES ONLY THE NEEDED UPDATES
    if (data.weight !== user.weight) changes.weight = data.weight;
    if (data.fitnessGoal !== user.fitnessGoal) changes.fitnessGoal = data.fitnessGoal;
    if (data.experienceLevel !== user.experienceLevel) changes.experienceLevel = data.experienceLevel;
    if (data.trainingStyle !== user.trainingStyle) changes.trainingStyle = data.trainingStyle;
    if (data.trainingFrequency !== user.trainingFrequency) changes.trainingFrequency = data.trainingFrequency;

    if (Object.keys(changes).length === 0) return res.status(400).json("No changes were made.");

    // UPDATES DETAILS
    await prisma.user.update({ where: { email }, data: changes });

    return res.status(200).json("Details updated successfully.");
}
