import { Pressable, Text, View } from "react-native";
import { useEffect, useState } from "react";
import Avatar from "../Avatar";
import LikeButton from "../../threads/LikeButton";
import ReplyButton from "../../threads/ReplyButton";
import EditButton from "../../threads/thread-details/edit-button/EditButton";
import DeleteButton from "../../threads/thread-details/delete-button/DeleteButton";
import { formatDateToTimeAgo } from "../../../libs/helpers/time/formatDateToTimeAgo";
import { ThreadType } from "../../../libs/types/threads/ThreadType";
import { likeThreadApi } from "../../../services/api/threads/likeThreadApi";
import { unlikeThreadApi } from "../../../services/api/threads/unlikeThreadApi";
import { editThreadApi } from "../../../services/api/threads/editThreadApi";
import { useAuth } from "../../../hooks/authContext";
import { styles } from "./styles";
import FeedbackModal from "../../FeedbackModal";

type ProfileThreadCardProps = {
    thread: ThreadType;
    onPress: () => void;
    onLikeUpdated: (payload: { threadId: number; likedByMe: boolean; likeCount: number }) => void;
    onThreadEdited: (payload: { threadId: number; title: string; body: string }) => void;
    onThreadDeleted: (threadId: number) => Promise<void> | void;
    onAuthorPress: (userId: number) => void;
    showEditedLabel: boolean;
};

export default function ProfileThreadCard({ thread, onPress, onAuthorPress, onLikeUpdated, onThreadEdited, onThreadDeleted, showEditedLabel }: ProfileThreadCardProps) {
    const { user } = useAuth();
    const canEdit = thread.author.id === user?.id;

    const [liked, setLiked] = useState(thread.likedByMe);
    const [likeCount, setLikeCount] = useState(thread.likeCount);
    const [loadingLike, setLoadingLike] = useState(false);
    const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

    const toggleLike = async () => {
        if (loadingLike) return;

        const nextLiked = !liked;
        const optimisticLikeCount = likeCount + (nextLiked ? 1 : -1);

        setLiked(nextLiked);
        setLikeCount(optimisticLikeCount);
        onLikeUpdated({ threadId: thread.id, likedByMe: nextLiked, likeCount: optimisticLikeCount });
        setLoadingLike(true);

        try {
            const res = nextLiked
                ? await likeThreadApi(thread.id)
                : await unlikeThreadApi(thread.id);

            setLiked(res.liked);
            setLikeCount(res.likeCount);
            onLikeUpdated({ threadId: thread.id, likedByMe: res.liked, likeCount: res.likeCount });
        } catch (e) {
            setLiked(!nextLiked);
            const revertedLikeCount = optimisticLikeCount + (nextLiked ? -1 : 1);
            setLikeCount(revertedLikeCount);
            onLikeUpdated({ threadId: thread.id, likedByMe: !nextLiked, likeCount: revertedLikeCount });
        } finally {
            setLoadingLike(false);
        }
    };

    useEffect(() => {
        setLiked(thread.likedByMe);
        setLikeCount(thread.likeCount);
    }, [thread.likedByMe, thread.likeCount]);

    const createdAt = new Date(thread.createdAt);
    const updatedAt = new Date(thread.updatedAt);

    const isEdited = createdAt.getTime() < updatedAt.getTime();

    return (
        <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
            <View style={styles.leftCol}>
                <Pressable
                    onPress={(e) => {
                        e.stopPropagation();
                        onAuthorPress(thread.author.id);
                    }}
                >
                    <Avatar avatarFileName={thread.author.avatarFileName} size={40} borderWidth={1} borderColor="green" />
                </Pressable>
            </View>

            <View style={styles.mainCol}>
                <View style={styles.headerLine}>
                    <View style={styles.headerLineMeta}>
                        <Pressable
                            onPress={(e) => {
                                e.stopPropagation();
                                onAuthorPress(thread.author.id);
                            }}
                        >
                            <Text style={styles.username}>{thread.author.username}</Text>
                        </Pressable>
                        <Text style={styles.time}>{formatDateToTimeAgo(createdAt)}</Text>
                        {(isEdited && showEditedLabel) && (<Text style={styles.edited}>(Edited: {formatDateToTimeAgo(updatedAt)} ago)</Text>)}
                    </View>

                    {canEdit && (
                        <View style={styles.actionsRow} onStartShouldSetResponder={() => true}>
                            <EditButton
                                initialTitle={thread.title}
                                initialBody={thread.body}
                                headerTitle="Edit thread"
                                onSubmit={async ({ title, body }) => {
                                    const res = await editThreadApi(thread.id, title!, body);
                                    const nextTitle = res.thread?.title ?? title!;
                                    const nextBody = res.thread?.body ?? body;

                                    onThreadEdited({
                                        threadId: thread.id,
                                        title: nextTitle,
                                        body: nextBody,
                                    });

                                    setFeedback({
                                        text: res.message ?? "Thread updated successfully.",
                                        success: true,
                                    });
                                }}
                            />

                            <DeleteButton
                                label="thread"
                                onDelete={async () => {
                                    await onThreadDeleted(thread.id);
                                }}
                            />
                        </View>
                    )}
                </View>

                <Text style={styles.threadTitle}>{thread.title}</Text>
                <Text style={styles.threadBody}>{thread.body}</Text>

                <View style={styles.buttonsRow}>
                    <LikeButton liked={liked} likeCount={likeCount} loading={loadingLike} onPress={toggleLike} />
                    <ReplyButton replyCount={thread.replyCount} />
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
