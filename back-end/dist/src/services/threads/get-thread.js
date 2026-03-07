"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getThreadService = getThreadService;
const db_1 = require("../../db");
async function getThreadService(userId, threadId, replies) {
    const skip = (replies.page - 1) * replies.limit;
    const thread = await db_1.prisma.thread.findUnique({
        where: { id: threadId },
        select: {
            id: true,
            title: true,
            body: true,
            createdAt: true,
            updatedAt: true,
            likeCount: true,
            replyCount: true,
            author: { select: { id: true, username: true, avatarFileName: true } },
            likes: {
                where: { userId },
                select: { id: true },
                take: 1,
            },
        },
    });
    if (!thread)
        return { status: "not_found" };
    const [repliesTotal, repliesRows] = await Promise.all([
        db_1.prisma.reply.count({ where: { threadId } }),
        db_1.prisma.reply.findMany({
            where: { threadId },
            orderBy: { createdAt: "desc" },
            skip,
            take: replies.limit,
            select: {
                id: true,
                body: true,
                createdAt: true,
                updatedAt: true,
                likeCount: true,
                author: { select: { id: true, username: true, avatarFileName: true } },
                likes: {
                    where: { userId },
                    select: { id: true },
                    take: 1,
                },
            },
        }),
    ]);
    const mappedReplies = repliesRows.map((r) => ({
        id: r.id,
        body: r.body,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        likeCount: r.likeCount,
        author: r.author,
        likedByMe: r.likes.length > 0,
    }));
    return {
        thread: {
            id: thread.id,
            title: thread.title,
            body: thread.body,
            createdAt: thread.createdAt,
            updatedAt: thread.updatedAt,
            likeCount: thread.likeCount,
            replyCount: thread.replyCount,
            author: thread.author,
            likedByMe: thread.likes.length > 0,
        },
        replies: {
            page: replies.page,
            limit: replies.limit,
            total: repliesTotal,
            totalPages: Math.ceil(repliesTotal / replies.limit),
            items: mappedReplies,
        },
    };
}
