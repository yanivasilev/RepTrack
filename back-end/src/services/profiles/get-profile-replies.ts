import { prisma } from "../../db";

export async function getProfileRepliesService(userId: number, targetUserId: number, opts: { page: number; limit: number }) {
    const { page, limit } = opts;
    const skip = (page - 1) * limit;

    const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { id: true },
    });

    // CHECKS IF USER EXISTS
    if (!targetUser) return { status: "not_found" as const };

    // GETS REPLIES FROM DB
    const [total, replies] = await Promise.all([
        prisma.reply.count({ where: { authorId: targetUserId } }),
        prisma.reply.findMany({
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

    // MAPS THEM TO CORRECT FORMAT
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

