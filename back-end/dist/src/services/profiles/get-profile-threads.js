"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileThreadsService = getProfileThreadsService;
const db_1 = require("../../db");
async function getProfileThreadsService(userId, targetUserId, opts) {
    const { page, limit } = opts;
    const skip = (page - 1) * limit;
    const targetUser = await db_1.prisma.user.findUnique({
        where: { id: targetUserId },
        select: { id: true },
    });
    if (!targetUser)
        return { status: "not_found" };
    const [total, threads] = await Promise.all([
        db_1.prisma.thread.count({ where: { authorId: targetUserId } }),
        db_1.prisma.thread.findMany({
            where: { authorId: targetUserId },
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            skip,
            take: limit,
            select: {
                id: true,
                title: true,
                body: true,
                createdAt: true,
                updatedAt: true,
                likeCount: true,
                replyCount: true,
                author: {
                    select: { id: true, username: true, avatarFileName: true },
                },
                likes: {
                    where: { userId },
                    select: { id: true },
                    take: 1,
                },
            },
        }),
    ]);
    const items = threads.map((t) => ({
        id: t.id,
        title: t.title,
        body: t.body,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        likeCount: t.likeCount,
        replyCount: t.replyCount,
        author: t.author,
        likedByMe: t.likes.length > 0,
    }));
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        items,
    };
}
