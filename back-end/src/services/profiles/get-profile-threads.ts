import { prisma } from "../../db";

export async function getProfileThreadsService(userId: number, targetUserId: number, opts: { page: number; limit: number }) {
    const { page, limit } = opts;
    const skip = (page - 1) * limit;

    const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { id: true },
    });

    // CHECKS IF USER EXISTS
    if (!targetUser) return { status: "not_found" as const };

    // GETS THREADS FROM DB
    const [total, threads] = await Promise.all([
        prisma.thread.count({ where: { authorId: targetUserId } }),
        prisma.thread.findMany({
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

    // MAPS THREADS TO THE CORRECT FORMAT
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

