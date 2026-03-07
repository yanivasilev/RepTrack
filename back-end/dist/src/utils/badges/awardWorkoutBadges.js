"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awardWorkoutBadges = awardWorkoutBadges;
const db_1 = require("../../db");
const getBadgeMetrics_1 = require("./getBadgeMetrics");
const resolveBadgeType_1 = require("./resolveBadgeType");
async function awardWorkoutBadges(userId) {
    const metrics = await (0, getBadgeMetrics_1.getBadgeMetrics)(userId);
    const targetTypes = (0, resolveBadgeType_1.resolveBadgeTypes)(metrics);
    if (targetTypes.length === 0)
        return [];
    const alreadyEarnedRows = await db_1.prisma.userBadge.findMany({
        where: {
            userId,
            badge: { type: { in: targetTypes } },
        },
        select: {
            badge: { select: { type: true } },
        },
    });
    const alreadyEarned = new Set(alreadyEarnedRows.map((row) => row.badge.type));
    const missingTypes = targetTypes.filter((type) => !alreadyEarned.has(type));
    if (missingTypes.length === 0)
        return [];
    const badges = await db_1.prisma.badge.findMany({
        where: { type: { in: missingTypes } },
        select: {
            id: true,
            type: true,
            name: true,
            icon: true,
        },
    });
    if (badges.length === 0)
        return [];
    for (const badge of badges) {
        await db_1.prisma.userBadge.upsert({
            where: {
                userId_badgeId: {
                    userId,
                    badgeId: badge.id,
                },
            },
            update: {},
            create: {
                userId,
                badgeId: badge.id,
            },
        });
    }
    return badges.map((badge) => ({
        type: badge.type,
        name: badge.name,
        icon: badge.icon,
    }));
}
