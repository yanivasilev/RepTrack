import type { Request, Response } from "express";
import { prisma } from "../../db";
import { getEmailFromAccessToken } from "../../services/getEmailbyAccessToken";
import { changehangeUsernameSchema } from "../../schemas/account/changeUsernameSchema";

export async function changeUsername(req: Request, res: Response) {
    const parsed = changehangeUsernameSchema.safeParse(req.body);

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

    // CHECK USER NAME COOLDOWN
    const COOLDOWN = 30 * 24 * 60 * 60 * 1000; // 30 DAYS

    if (user.lastUsernameChangeAt) {
        const timeSinceChange = Date.now() - user.lastUsernameChangeAt.getTime();

        if (timeSinceChange < COOLDOWN) {
            const daysLeft = Math.ceil((COOLDOWN - timeSinceChange) / (24 * 60 * 60 * 1000));

            return res.status(403).json(`You can only change your username once every 30 days. Try again in ${daysLeft} days.`);
        }
    }

    // CHECKS IF CURRENT USERNAME IS VALID
    if (data.currentUsername !== user.username) return res.status(404).json("Current username is invalid.");

    // CHECKS IF NEW USERNAME IS TAKEN
    const isNewUsernameTaken = await prisma.user.findUnique({ where: { username: data.newUsername } });
    if (isNewUsernameTaken) return res.status(409).json("Username is already taken.");

    // UPDATES USERNAME
    await prisma.user.update({ where: { email }, data: { username: data.newUsername, lastUsernameChangeAt: new Date() } });

    return res.status(200).json("Username updated successfully.");
}
