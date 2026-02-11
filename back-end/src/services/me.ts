import { prisma } from "../db";
import { calculateAge } from "../utils/calculateAge";

export async function meService(user: { email: string }) {
    const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: {
            id: true,
            username: true,
            fitnessGoal: true,
            experienceLevel: true,
            trainingStyle: true,
            trainingFrequency: true,
            weight: true,
            dob: true,
            avatarFileName: true,
            weightUnitType: true,
            heightUnitType: true
        },
    });

    if (!dbUser) return null;

    const age = calculateAge(dbUser.dob);

    const { dob, ...rest } = dbUser;

    return {
        ...rest,
        age,
    };
}
