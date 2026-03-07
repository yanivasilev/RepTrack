"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileByIdService = getProfileByIdService;
const db_1 = require("../../db");
const calculateAge_1 = require("../../utils/calculateAge");
async function getProfileByIdService(userId, targetUserId) {
    const [user, targetUser] = await Promise.all([
        db_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                weightUnitType: true,
                heightUnitType: true,
            },
        }),
        db_1.prisma.user.findUnique({
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
    if (!targetUser || !user)
        return { status: "not_found" };
    const age = (0, calculateAge_1.calculateAge)(targetUser.dob);
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
