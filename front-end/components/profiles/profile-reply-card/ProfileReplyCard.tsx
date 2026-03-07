import { Pressable, Text, View } from "react-native";
import Avatar from "../Avatar";
import { formatDateToTimeAgo } from "../../../libs/helpers/time/formatDateToTimeAgo";
import LikeButton from "../../threads/LikeButton";
import { useEffect, useState } from "react";
import { styles } from "./styles";
import { ProfileReplyType } from "../../../libs/types/profiles/ProfileReplyType";
import { likeReplyApi } from "../../../services/api/threads/replies/likeReplyApi";
import { unlikeReplyApi } from "../../../services/api/threads/replies/unlikeReplyApi";
import { useAuth } from "../../../hooks/authContext";
import { editReplyApi } from "../../../services/api/threads/replies/editReplyApi";
import EditButton from "../../threads/thread-details/edit-button/EditButton";
import DeleteButton from "../../threads/thread-details/delete-button/DeleteButton";
import FeedbackModal from "../../FeedbackModal";

type ProfileReplyCardProps = {
    reply: ProfileReplyType;
    onLikeUpdated: (payload: { replyId: number; likedByMe: boolean; likeCount: number }) => void;
    onEdited: (next: ProfileReplyType) => void;
    onDeleted: (replyId: number) => Promise<void> | void;
    onOpenThread: (threadId: number) => void;
    onAuthorPress: (userId: number) => void;
    showEditedLabel?: boolean;
};

export default function ProfileReplyCard({ reply, onLikeUpdated, onEdited, onDeleted, onAuthorPress, onOpenThread, showEditedLabel = false }: ProfileReplyCardProps) {
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
        onLikeUpdated({ replyId: reply.id, likedByMe: nextLiked, likeCount: optimisticLikeCount });
        setLoadingLike(true);

        try {
            const res = nextLiked
                ? await likeReplyApi(reply.id)
                : await unlikeReplyApi(reply.id);

            setLiked(res.liked);
            setLikeCount(res.likeCount);
            onLikeUpdated({ replyId: reply.id, likedByMe: res.liked, likeCount: res.likeCount });
        } catch (e) {
            setLiked(!nextLiked);
            const revertedLikeCount = optimisticLikeCount + (nextLiked ? -1 : 1);
            setLikeCount(revertedLikeCount);
            onLikeUpdated({ replyId: reply.id, likedByMe: !nextLiked, likeCount: revertedLikeCount });
        } finally {
            setLoadingLike(false);
        }
    };

    useEffect(() => {
        setLiked(reply.likedByMe);
        setLikeCount(reply.likeCount);
    }, [reply.likedByMe, reply.likeCount]);

    const createdAt = new Date(reply.createdAt);
    const updatedAt = new Date(reply.updatedAt);

    const isEdited = createdAt.getTime() < updatedAt.getTime();

    return (
        <Pressable onPress={() => onOpenThread(reply.thread.id)} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
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
                        {(isEdited && showEditedLabel) && (<Text style={styles.edited}>(Edited: {formatDateToTimeAgo(updatedAt)} ago)</Text>)}
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
        </Pressable>
    );
}
