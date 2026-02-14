import { prisma } from "../../db";

export async function getAllThreadsService(userId: number, opts: { page: number; limit: number }) {
    const { page, limit } = opts;
    const skip = (page - 1) * limit;

    const [total, threads] = await Promise.all([
        prisma.thread.count(),
        prisma.thread.findMany({
            orderBy: { createdAt: "desc" },
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
                // IF THERE IS A LIKE ROW, THE USER HAS LIKED THE THREAD
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
