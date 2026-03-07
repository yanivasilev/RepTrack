import { prisma } from "../../db";
import { calculateAge } from "../../utils/calculateAge";

export async function getProfileByIdService(userId: number, targetUserId: number) {
    // GETS PROFILE FROM DB
    const [user, targetUser] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                weightUnitType: true,
                heightUnitType: true,
            },
        }),
        prisma.user.findUnique({
            where: { id: targetUserId },
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
        }),
    ]);

    // CHECKS IF PROFILE EXISTS
    if (!targetUser || !user) return { status: "not_found" as const };

    // ADDS AGE AND BADGES
    const age = calculateAge(targetUser.dob);
    const badges = targetUser.userBadges.map((userBadge) => ({
        ...userBadge.badge,
        earnedAt: userBadge.earnedAt,
    }));
    const { dob, userBadges, ...rest } = targetUser;

    return {
        ...rest,
        age,
        badges,
        weightUnitType: user.weightUnitType,
        heightUnitType: user.heightUnitType,
    };
}
