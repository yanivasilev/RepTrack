export type ThreadType = {
    id: number;
    title: string;
    body: string;
    createdAt: string;
    updatedAt: string;
    likeCount: number;
    replyCount: number;
    author: {
        id: number;
        username: string;
        avatarFileName: string;
    },
    likedByMe: boolean;
}
