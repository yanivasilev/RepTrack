import { BadgeType } from "../../../generated/prisma/enums";
import { prisma } from "../../db";
import { getBadgeMetrics } from "./getBadgeMetrics";
import { resolveBadgeType } from "./resolveBadgeType";

type EarnedBadge = {
    type: BadgeType;
    name: string;
    icon: string;
};

export async function awardWorkoutBadges(userId: number): Promise<EarnedBadge[]> {
    const metrics = await getBadgeMetrics(userId);
    const targetTypes = resolveBadgeType(metrics);

    if (targetTypes.length === 0) return [];

    // FINDS BADGES USER ALREADY HAS
    const alreadyEarnedRows = await prisma.userBadge.findMany({
        where: {
            userId,
            badge: { type: { in: targetTypes } },
        },
        select: {
            badge: { select: { type: true } },
        },
    });

    // REMOVE BADGES ALREADY EARNED
    const alreadyEarned = new Set<BadgeType>(alreadyEarnedRows.map((row) => row.badge.type));
    const missingTypes = targetTypes.filter((type) => !alreadyEarned.has(type));

    if (missingTypes.length === 0) return [];

    // LOAD BADGES FROM DB
    const badges = await prisma.badge.findMany({
        where: { type: { in: missingTypes } },
        select: {
            id: true,
            type: true,
            name: true,
            icon: true,
        },
    });

    if (badges.length === 0) return [];

    // CREATE BADGE RECORD IN DB
    for (const badge of badges) {
        await prisma.userBadge.upsert({
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
