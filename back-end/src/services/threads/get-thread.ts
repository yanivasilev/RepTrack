import { prisma } from "../../db";

export async function getThreadService(userId: number, threadId: number, replies: { page: number; limit: number }) {
    const skip = (replies.page - 1) * replies.limit;

    const thread = await prisma.thread.findUnique({
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

    // CHECKS IF THREAD EXISTS
    if (!thread) return { status: "not_found" as const };

    // GETS THE REPLIES OF THE THREAD
    const [repliesTotal, repliesRows] = await Promise.all([
        prisma.reply.count({ where: { threadId } }),
        prisma.reply.findMany({
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

    // MAPS THEM TO CORRECT FORMAT
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
