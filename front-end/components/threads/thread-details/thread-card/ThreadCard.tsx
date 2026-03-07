import { View, Text, Pressable } from "react-native";
import { ThreadType } from "../../../../libs/types/threads/ThreadType";
import Avatar from "../../../profiles/Avatar";
import { formatDateToTimeAgo } from "../../../../libs/helpers/time/formatDateToTimeAgo";
import { useEffect, useState } from "react";
import { unlikeThreadApi } from "../../../../services/api/threads/unlikeThreadApi";
import { likeThreadApi } from "../../../../services/api/threads/likeThreadApi";
import { styles } from "./styles";
import LikeButton from "../../LikeButton";
import ReplyButton from "../../ReplyButton";
import { editThreadApi } from "../../../../services/api/threads/editThreadApi";
import { useAuth } from "../../../../hooks/authContext";
import EditButton from "../edit-button/EditButton";
import DeleteButton from "../delete-button/DeleteButton";
import FeedbackModal from "../../../FeedbackModal";

type ThreadCardProps = {
    thread: ThreadType;
    onLikeUpdated: (payload: {
        threadId: number;
        likedByMe: boolean;
        likeCount: number;
    }) => void;
    onEdited: (payload: { threadId: number; title: string; body: string }) => void;
    onDeleted: (threadId: number) => Promise<void> | void;
    onAuthorPress: (userId: number) => void;
};

export default function ThreadCard({ thread, onLikeUpdated, onEdited, onDeleted, onAuthorPress }: ThreadCardProps) {
    const { user } = useAuth();
    const canEdit = thread.author.id === user?.id;

    const [liked, setLiked] = useState(thread.likedByMe);
    const [likeCount, setLikeCount] = useState(thread.likeCount);
    const [loadingLike, setLoadingLike] = useState(false);
    const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

    const toggleLike = async () => {
        if (loadingLike) return;

        const nextLiked = !liked;

        setLiked(nextLiked);
        setLikeCount((c) => c + (nextLiked ? 1 : -1));
        setLoadingLike(true);

        try {
            const res = nextLiked
                ? await likeThreadApi(thread.id)
                : await unlikeThreadApi(thread.id);

            setLiked(res.liked);
            setLikeCount(res.likeCount);

            onLikeUpdated?.({
                threadId: thread.id,
                likedByMe: res.liked,
                likeCount: res.likeCount,
            });
        } catch (e) {
            setLiked(!nextLiked);
            setLikeCount((c) => c + (nextLiked ? -1 : 1));
        } finally {
            setLoadingLike(false);
        }
    };

    useEffect(() => {
        setLiked(thread.likedByMe);
        setLikeCount(thread.likeCount);
    }, [thread.likedByMe, thread.likeCount]);

    const createdAt = new Date(thread.createdAt);

    return (
        <View style={styles.card}>
            <View style={styles.mainCol}>
                <View style={styles.headerLine}>
                    <View style={styles.headerLineContainer}>
                        <Pressable
                            onPress={(e) => {
                                e.stopPropagation();
                                onAuthorPress(thread.author.id);
                            }}
                        >
                            <Avatar avatarFileName={thread.author.avatarFileName} size={40} borderWidth={1} borderColor="green" />
                        </Pressable>
                        <Pressable
                            onPress={(e) => {
                                e.stopPropagation();
                                onAuthorPress(thread.author.id);
                            }}
                        >
                            <Text style={styles.username}>{thread.author.username}</Text>
                        </Pressable>
                        <Text style={styles.time}>{formatDateToTimeAgo(createdAt)}</Text>
                    </View>

                    {canEdit && (
                        <View style={styles.actionsRow}>
                            <EditButton
                                initialTitle={thread.title}
                                initialBody={thread.body}
                                headerTitle="Edit thread"
                                onSubmit={async ({ title, body }) => {
                                    const res = await editThreadApi(thread.id, title!, body);

                                    const nextTitle = res.thread?.title ?? title!;
                                    const nextBody = res.thread?.body ?? body;

                                    onEdited?.({
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
                                    await onDeleted(thread.id);
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
        </View>
    );
}
