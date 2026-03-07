export type ReplyType = {
    id: number;
    body: string;
    createdAt: string;
    updatedAt: string;
    likeCount: number;
    author: {
        id: number;
        username: string;
        avatarFileName: string;
    },
    likedByMe: boolean;
}