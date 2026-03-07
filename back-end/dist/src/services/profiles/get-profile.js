"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileService = getProfileService;
const db_1 = require("../../db");
const calculateAge_1 = require("../../utils/calculateAge");
async function getProfileService(userId) {
    const user = await db_1.prisma.user.findUnique({
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
    if (!user)
        return { status: "not_found" };
    const age = (0, calculateAge_1.calculateAge)(user.dob);
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
