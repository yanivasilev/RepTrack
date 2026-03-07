"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileRepliesService = getProfileRepliesService;
const db_1 = require("../../db");
async function getProfileRepliesService(userId, targetUserId, opts) {
    const { page, limit } = opts;
    const skip = (page - 1) * limit;
    const targetUser = await db_1.prisma.user.findUnique({
        where: { id: targetUserId },
        select: { id: true },
    });
    if (!targetUser)
        return { status: "not_found" };
    const [total, replies] = await Promise.all([
        db_1.prisma.reply.count({ where: { authorId: targetUserId } }),
        db_1.prisma.reply.findMany({
            where: { authorId: targetUserId },
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            skip,
            take: limit,
            select: {
                id: true,
                body: true,
                createdAt: true,
                updatedAt: true,
                likeCount: true,
                thread: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
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
    const items = replies.map((r) => ({
        id: r.id,
        body: r.body,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        likeCount: r.likeCount,
        thread: r.thread,
        author: r.author,
        likedByMe: r.likes.length > 0,
    }));
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        items,
    };
}
