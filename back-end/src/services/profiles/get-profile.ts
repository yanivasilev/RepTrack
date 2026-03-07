import { prisma } from "../../db";
import { calculateAge } from "../../utils/calculateAge";

export async function getProfileService(userId: number) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
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
            heightUnitType: true,
            userBadges: {
                orderBy: { earnedAt: "desc" },
                select: {
                    earnedAt: true,
                    badge: {
                        select: {
                            type: true,
                            name: true,
                            icon: true,
                        },
                    },
                },
            },
        },
    });

    // CHECKS IF USER EXISTS
    if (!user) return { status: "not_found" as const };

    // ADDS AGE AND BADGES
    const age = calculateAge(user.dob);
    const badges = user.userBadges.map((userBadge) => ({
        ...userBadge.badge,
        earnedAt: userBadge.earnedAt,
    }));
    const { dob, userBadges, ...rest } = user;

    return {
        ...rest,
        age,
        badges,
    };
}
