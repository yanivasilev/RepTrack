import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from './styles';
import React, { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { ThreadType } from "../../../libs/types/threads/ThreadType";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import { ThreadsParamList } from "../../../navigation/ThreadsNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ReplyType } from "../../../libs/types/threads/ReplyType";
import { getThreadApi } from "../../../services/api/threads/getThreadApi";
import BackButton from "../../../components/buttons/BackButton";
import ThreadCard from "../../../components/threads/thread-details/thread-card/ThreadCard";
import { Paginated } from "../../../libs/types/Paginated";
import ReplyCard from "../../../components/threads/thread-details/reply-card/ReplyCard";
import CreateReply from "../../../components/threads/thread-details/create-reply/CreateReply";
import { createReplyApi } from "../../../services/api/threads/replies/createReplyApi";
import { deleteThreadApi } from "../../../services/api/threads/deleteThreadApi";
import { deleteReplyApi } from "../../../services/api/threads/replies/deleteReplyApi";
import FeedbackModal from "../../../components/FeedbackModal";

type Props = NativeStackScreenProps<ThreadsParamList, "ThreadDetails">;

export default function ThreadDetailsScreen({ route, navigation }: Props) {
    const { threadId, onThreadUpdated, onThreadDeleted, onReplyUpdated, source, sourceUserId, activityMode } = route.params;

    const [thread, setThread] = useState<ThreadType | null>(null);
    const [replies, setReplies] = useState<Paginated<ReplyType> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [deletingThread, setDeletingThread] = useState(false);
    const [deletingReply, setDeletingReply] = useState(false);
    const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);
    const [goBackAfterFeedback, setGoBackAfterFeedback] = useState(false);

    const removeDuplicateRepliesById = (replies: ReplyType[]) => {
        const seen = new Set<number>();

        return replies.filter((reply) => {
            if (seen.has(reply.id)) return false;
            seen.add(reply.id);
            return true;
        });
    };

    const loadMoreReplies = async () => {
        if (loadingMore) return;
        if (!replies) return;

        const hasMoreReplies = replies.page < replies.totalPages;
        if (!hasMoreReplies) return;

        setLoadingMore(true);
        try {
            const nextPage = replies.page + 1;
            const res = await getThreadApi(threadId, { page: nextPage, limit: replies.limit });

            setReplies((prev) =>
                prev ? {
                    ...prev,
                    page: res.replies.page,
                    limit: res.replies.limit,
                    total: res.replies.total,
                    totalPages: res.replies.totalPages,
                    items: removeDuplicateRepliesById([...prev.items, ...res.replies.items]),
                } : res.replies
            );
        } catch (e) {
            // ADD ERROR LATER
        } finally {
            setLoadingMore(false);
        }
    }

    const handleReplyEdited = (reply: ReplyType) => {
        setReplies((prev) =>
            prev ? {
                ...prev,
                items: prev.items.map((r) =>
                    r.id === reply.id ? { ...r, ...reply } : r
                ),
            } : prev
        );
        onReplyUpdated?.({
            replyId: reply.id,
            body: reply.body,
            updatedAt: reply.updatedAt,
        });
    };

    const handleReplyDeleted = (replyId: number) => {
        setReplies((prev) => {
            if (!prev) return prev;

            const nextItems = prev.items.filter((r) => r.id !== replyId);
            if (nextItems.length === prev.items.length) return prev;

            return {
                ...prev,
                items: nextItems,
                total: Math.max(0, prev.total - 1),
            };
        });

        if (thread) {
            const nextReplyCount = Math.max(0, thread.replyCount - 1);
            setThread({ ...thread, replyCount: nextReplyCount });
            onThreadUpdated({ threadId: thread.id, replyCount: nextReplyCount });
        }

        onReplyUpdated?.({
            replyId,
            deleted: true,
        });
    };

    const handleBack = () => {
        if (source === "profile") {
            navigation.getParent()?.navigate("Profile", { screen: "Profile", params: { activityMode } });
            return;
        }

        if (source === "userProfile" && sourceUserId != null) {
            navigation.getParent()?.navigate("Profile", {
                screen: "UserProfile",
                params: { userId: sourceUserId, activityMode },
            } as never);
            return;
        }

        navigation.goBack();
    };

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await getThreadApi(threadId);
                if (!mounted) return;

                if (!res.thread) {
                    setThread(null);
                    setError("Thread not found.");
                } else {
                    setThread(res.thread);
                    setReplies({
                        ...res.replies,
                        items: removeDuplicateRepliesById(res.replies.items),
                    });
                }
            } catch (error: any) {
                if (!mounted) return;
                setError(error?.message ?? "Something went wrong.");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false }
    }, [threadId]);

    if (loading) return <Loading navigation={navigation} message="Loading thread..." />

    if (deletingThread) return <Loading message="Deleting thread..." />

    if (deletingReply) return <Loading message="Deleting reply..." />

    if (error || !thread) return <Error error={error ?? "Something went wrong."} />

    return (
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
            <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}>

                <BackButton navigation={navigation} onPress={handleBack} />

                <FlatList<ReplyType>
                    style={{ flex: 1 }}
                    data={replies?.items ?? []}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.container}
                    ListHeaderComponent={
                        <View style={{ gap: 10 }}>
                            <ThreadCard
                                thread={thread}
                                onLikeUpdated={(payload) => {
                                    setThread((prev) => prev && prev.id === payload.threadId ? { ...prev, likedByMe: payload.likedByMe, likeCount: payload.likeCount } : prev);
                                    onThreadUpdated(payload);
                                }}
                                onEdited={({ threadId, title, body }) => {
                                    setThread((prev) => (prev && prev.id === threadId ? { ...prev, title, body } : prev));
                                    onThreadUpdated({ threadId, title, body });
                                }}
                                onDeleted={async (deletedThreadId) => {
                                    setDeletingThread(true);
                                    try {
                                        const res = await deleteThreadApi(deletedThreadId);
                                        setDeletingThread(false);
                                        onThreadDeleted?.(deletedThreadId);
                                        setFeedback({
                                            text: res.message ?? "Thread deleted.",
                                            success: true,
                                        });
                                        setGoBackAfterFeedback(true);
                                    } catch (e: any) {
                                        setDeletingThread(false);
                                        setFeedback({
                                            text: e?.message ?? "Delete thread failed.",
                                            success: false,
                                        });
                                    }
                                }}
                                onAuthorPress={(userId) => navigation.getParent()?.navigate("Profile", { screen: "UserProfile", params: { userId, source: "threadDetails", threadId } })}
                            />

                            <Text style={styles.repliesTitle}>Replies</Text>
                        </View>
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                No replies yet. Be the first one!
                            </Text>
                        </View>
                    }
                    onEndReached={loadMoreReplies}
                    onEndReachedThreshold={0.4}
                    ListFooterComponent={loadingMore ? <Loading message="Loading replies..." /> : null}
                    renderItem={({ item }) => (
                        <ReplyCard
                            reply={item}
                            onLikeUpdated={({ replyId, likedByMe, likeCount }) => {
                                setReplies((prev) =>
                                    prev ? {
                                        ...prev,
                                        items: prev.items.map((r) =>
                                            r.id === replyId ? { ...r, likedByMe, likeCount } : r
                                        ),
                                    } : prev
                                );
                                onReplyUpdated?.({ replyId, likedByMe, likeCount });
                            }}
                            onEdited={handleReplyEdited}
                            onDeleted={async (replyId) => {
                                setDeletingReply(true);
                                try {
                                    const res = await deleteReplyApi(replyId);
                                    handleReplyDeleted(replyId);
                                    setFeedback({
                                        text: res.message ?? "Reply deleted.",
                                        success: true,
                                    });
                                } catch (e: any) {
                                    setFeedback({
                                        text: e?.message ?? "Delete reply failed.",
                                        success: false,
                                    });
                                } finally {
                                    setDeletingReply(false);
                                }
                            }}
                            onAuthorPress={(userId) => navigation.getParent()?.navigate("Profile", { screen: "UserProfile", params: { userId, source: "threadDetails", threadId } })}
                        />
                    )}
                />

                <CreateReply
                    onSubmit={async (text) => {
                        try {
                            const res = await createReplyApi(threadId, text);
                            const createdReply: ReplyType = {
                                id: res.reply.id,
                                body: res.reply.body ?? text,
                                createdAt: res.reply.createdAt ?? new Date().toISOString(),
                                updatedAt: res.reply.updatedAt ?? res.reply.createdAt ?? new Date().toISOString(),
                                likeCount: res.reply.likeCount ?? 0,
                                likedByMe: res.reply.likedByMe ?? false,
                                author: res.reply.author ?? {
                                    id: 0,
                                    username: "Unknown",
                                    avatarUrl: "",
                                },
                            };

                            setReplies((prev) =>
                                prev ? {
                                    ...prev,
                                    items: removeDuplicateRepliesById([createdReply, ...prev.items]),
                                    total: prev.total + 1,
                                } : prev
                            );

                            const nextReplyCount = (thread?.replyCount ?? 0) + 1;

                            setThread((prev) => (prev ? { ...prev, replyCount: nextReplyCount } : prev));
                            onThreadUpdated({ threadId, replyCount: nextReplyCount });
                            setFeedback({
                                text: res.message ?? "Reply created.",
                                success: true,
                            });
                        } catch (e: any) {
                            setFeedback({
                                text: e?.message ?? "Creating reply failed.",
                                success: false,
                            });
                            throw e;
                        }
                    }}
                />
            </KeyboardAvoidingView>

            <FeedbackModal
                visible={Boolean(feedback)}
                message={feedback?.text}
                success={feedback?.success}
                onClose={() => {
                    setFeedback(null);
                    if (goBackAfterFeedback) {
                        setGoBackAfterFeedback(false);
                        handleBack();
                    }
                }}
            />
        </SafeAreaView>
    );
}
