import { View, Text, Pressable } from "react-native";
import Avatar from "../../../profiles/Avatar";
import { formatDateToTimeAgo } from "../../../../libs/helpers/time/formatDateToTimeAgo";
import LikeButton from "../../LikeButton";
import { useEffect, useState } from "react";
import { styles } from "./styles";
import { ReplyType } from "../../../../libs/types/threads/ReplyType";
import { likeReplyApi } from "../../../../services/api/threads/replies/likeReplyApi";
import { unlikeReplyApi } from "../../../../services/api/threads/replies/unlikeReplyApi";
import { useAuth } from "../../../../hooks/authContext";
import { editReplyApi } from "../../../../services/api/threads/replies/editReplyApi";
import EditButton from "../edit-button/EditButton";
import DeleteButton from "../delete-button/DeleteButton";
import FeedbackModal from "../../../FeedbackModal";

type ReplyCardProps = {
    reply: ReplyType;
    onLikeUpdated?: (payload: { replyId: number; likedByMe: boolean; likeCount: number }) => void;
    onEdited: (next: ReplyType) => void;
    onDeleted: (replyId: number) => Promise<void> | void;
    onAuthorPress: (userId: number) => void;
};

export default function ReplyCard({ reply, onLikeUpdated, onEdited, onDeleted, onAuthorPress }: ReplyCardProps) {
    const { user } = useAuth();
    const canEdit = reply.author.id === user?.id;

    const [liked, setLiked] = useState(reply.likedByMe);
    const [likeCount, setLikeCount] = useState(reply.likeCount);
    const [loadingLike, setLoadingLike] = useState(false);
    const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

    const toggleLike = async () => {
        if (loadingLike) return;

        const nextLiked = !liked;
        const optimisticLikeCount = likeCount + (nextLiked ? 1 : -1);

        setLiked(nextLiked);
        setLikeCount(optimisticLikeCount);
        onLikeUpdated?.({ replyId: reply.id, likedByMe: nextLiked, likeCount: optimisticLikeCount });
        setLoadingLike(true);

        try {
            const res = nextLiked
                ? await likeReplyApi(reply.id)
                : await unlikeReplyApi(reply.id);

            setLiked(res.liked);
            setLikeCount(res.likeCount);
            onLikeUpdated?.({ replyId: reply.id, likedByMe: res.liked, likeCount: res.likeCount });
        } catch (e) {
            setLiked(!nextLiked);
            const revertedLikeCount = optimisticLikeCount + (nextLiked ? -1 : 1);
            setLikeCount(revertedLikeCount);
            onLikeUpdated?.({ replyId: reply.id, likedByMe: !nextLiked, likeCount: revertedLikeCount });
        } finally {
            setLoadingLike(false);
        }
    };

    useEffect(() => {
        setLiked(reply.likedByMe);
        setLikeCount(reply.likeCount);
    }, [reply.likedByMe, reply.likeCount]);

    const createdAt = new Date(reply.createdAt);

    return (
        <View style={styles.card}>
            <View style={styles.leftCol}>
                <Pressable
                    onPress={(e) => {
                        e.stopPropagation();
                        onAuthorPress(reply.author.id);
                    }}
                >
                    <Avatar avatarFileName={reply.author.avatarFileName} size={40} borderWidth={1} borderColor="green" />
                </Pressable>
            </View>

            <View style={styles.mainCol}>
                <View style={styles.headerLine}>
                    <View style={styles.details}>
                        <Pressable
                            onPress={(e) => {
                                e.stopPropagation();
                                onAuthorPress(reply.author.id);
                            }}
                        >
                            <Text style={styles.username}>{reply.author.username}</Text>
                        </Pressable>
                        <Text style={styles.time}>{formatDateToTimeAgo(createdAt)}</Text>
                    </View>
                    {canEdit && (
                        <View style={styles.actionsRow}>
                            <EditButton
                                initialBody={reply.body}
                                headerTitle="Edit reply"
                                maxBodyLength={2000}
                                onSubmit={async ({ body }) => {
                                    const res = await editReplyApi(reply.id, body);
                                    onEdited({ ...reply, ...res.reply });
                                    setFeedback({
                                        text: res.message ?? "Reply updated successfully.",
                                        success: true,
                                    });
                                }}
                            />

                            <DeleteButton
                                label="reply"
                                onDelete={async () => {
                                    await onDeleted(reply.id);
                                }}
                            />
                        </View>
                    )}
                </View>

                <Text style={styles.replyBody}>{reply.body}</Text>

                <View style={styles.buttonsRow}>
                    <LikeButton liked={liked} likeCount={likeCount} loading={loadingLike} onPress={toggleLike} />
                </View>
            </View>

            <FeedbackModal
                visible={Boolean(feedback)}
                message={feedback?.text}
                success={feedback?.success}
                onClose={() => setFeedback(null)}
            />
        </View>
    );
}
