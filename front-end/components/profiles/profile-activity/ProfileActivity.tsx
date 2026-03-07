import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ProfileThreadCard from "../profile-thread-card/ProfileThreadCard";
import ProfileReplyCard from "../profile-reply-card/ProfileReplyCard";
import { ThreadType } from "../../../libs/types/threads/ThreadType";
import { ProfileReplyType } from "../../../libs/types/profiles/ProfileReplyType";
import { getProfileThreadsApi } from "../../../services/api/profiles/getProfileThreadsApi";
import { getProfileRepliesApi } from "../../../services/api/profiles/getProfileRepliesApi";
import { deleteReplyApi } from "../../../services/api/threads/replies/deleteReplyApi";
import { deleteThreadApi } from "../../../services/api/threads/deleteThreadApi";
import { styles } from "./styles";
import { ProfileActivityModeType } from "../../../libs/types/profiles/ProfileActivityModeType";
import FeedbackModal from "../../FeedbackModal";

type ListItem =
    | { kind: "thread"; id: number; thread: ThreadType }
    | { kind: "reply"; id: number; reply: ProfileReplyType };

type ProfileActivityProps = {
    userId: number;
    initialMode?: ProfileActivityModeType;
    header?: React.ReactNode;
    onOpenThread: (payload: {
        threadId: number;
        sourceActivityMode: ProfileActivityModeType;
        onThreadUpdated: (args: {
            threadId: number;
            likedByMe?: boolean;
            likeCount?: number;
            replyCount?: number;
            title?: string;
            body?: string;
        }) => void;
        onThreadDeleted: (threadId: number) => void;
        onReplyUpdated?: (args: {
            replyId: number;
            likedByMe?: boolean;
            likeCount?: number;
            body?: string;
            updatedAt?: string;
            deleted?: boolean;
        }) => void;
    }) => void;
    onOpenUserProfile: (userId: number) => void;
    showEditedLabel?: boolean;
};

export default function ProfileActivity({ userId, initialMode = "threads", header, onOpenThread, onOpenUserProfile, showEditedLabel = false }: ProfileActivityProps) {
    const [mode, setMode] = useState<ProfileActivityModeType>(initialMode);

    const [threads, setThreads] = useState<ThreadType[]>([]);
    const [replies, setReplies] = useState<ProfileReplyType[]>([]);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

    const removeDuplicateThreadsById = (items: ThreadType[]) => {
        const seen = new Set<number>();
        return items.filter((thread) => {
            if (seen.has(thread.id)) return false;
            seen.add(thread.id);
            return true;
        });
    };

    const removeDuplicateRepliesById = (items: ProfileReplyType[]) => {
        const seen = new Set<number>();
        return items.filter((reply) => {
            if (seen.has(reply.id)) return false;
            seen.add(reply.id);
            return true;
        });
    };

    const fetchThreads = async (opts?: { reset?: boolean; pageOverride?: number }) => {
        const reset = opts?.reset ?? false;
        const nextPage = opts?.pageOverride ?? (reset ? 1 : page);

        if (reset) setLoadingSearch(true);
        else setLoadingMore(true);

        try {
            setError(null);
            const res = await getProfileThreadsApi(userId, { page: nextPage, limit: 10 });
            setTotalPages(res.totalPages);

            if (reset) {
                setThreads(removeDuplicateThreadsById(res.items));
                setPage(1);
            } else {
                setThreads((prev) => removeDuplicateThreadsById([...prev, ...res.items]));
                setPage(nextPage);
            }
        } catch (e: any) {
            setError(e?.message ?? "Something went wrong.");
        } finally {
            if (reset) setLoadingSearch(false);
            else setLoadingMore(false);
        }
    };

    const fetchReplies = async (opts?: { reset?: boolean; pageOverride?: number }) => {
        const reset = opts?.reset ?? false;
        const nextPage = opts?.pageOverride ?? (reset ? 1 : page);

        if (reset) setLoadingSearch(true);
        else setLoadingMore(true);

        try {
            setError(null);
            const res = await getProfileRepliesApi(userId, { page: nextPage, limit: 10 });
            setTotalPages(res.totalPages);

            if (reset) {
                setReplies(removeDuplicateRepliesById(res.items));
                setPage(1);
            } else {
                setReplies((prev) => removeDuplicateRepliesById([...prev, ...res.items]));
                setPage(nextPage);
            }
        } catch (e: any) {
            setError(e?.message ?? "Something went wrong.");
        } finally {
            if (reset) setLoadingSearch(false);
            else setLoadingMore(false);
        }
    };

    const loadMore = async () => {
        if (loadingMore || loadingSearch) return;
        if (page >= totalPages) return;

        if (mode === "threads") await fetchThreads({ reset: false, pageOverride: page + 1 });
        else await fetchReplies({ reset: false, pageOverride: page + 1 });
    };

    useEffect(() => {
        if (mode === "threads") fetchThreads({ reset: true });
        else fetchReplies({ reset: true });
    }, [mode, userId]);

    useEffect(() => {
        setMode(initialMode);
    }, [initialMode]);

    const listItems = useMemo<ListItem[]>(() => {
        if (mode === "threads") {
            return threads.map((thread) => ({ kind: "thread", id: thread.id, thread }));
        }

        return replies.map((reply) => ({ kind: "reply", id: reply.id, reply }));
    }, [mode, threads, replies]);

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable
                    style={({ pressed }) => [styles.retryButton, pressed && { opacity: 0.7 }]}
                    onPress={() => {
                        if (mode === "threads") fetchThreads({ reset: true });
                        else fetchReplies({ reset: true });
                    }}
                >
                    <Text style={styles.retryText}>RETRY</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <FlatList<ListItem>
                data={listItems}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                onEndReached={loadMore}
                onEndReachedThreshold={0.4}
                ListHeaderComponent={
                    <>
                        {header}

                        <View style={styles.filtersWrap}>
                            <View style={styles.filtersContainer}>
                                <Pressable
                                    onPress={() => setMode("threads")}
                                    style={[styles.filterButton, mode === "threads" && styles.filterButtonActive]}
                                >
                                    <Text style={[styles.filterText, mode === "threads" && styles.filterTextActive]}>THREADS</Text>
                                </Pressable>

                                <Pressable
                                    onPress={() => setMode("replies")}
                                    style={[styles.filterButton, mode === "replies" && styles.filterButtonActive]}
                                >
                                    <Text style={[styles.filterText, mode === "replies" && styles.filterTextActive]}>REPLIES</Text>
                                </Pressable>
                            </View>
                        </View>

                        {loadingSearch ? (
                            <View style={styles.headerLoader}>
                                <ActivityIndicator size="large" color="green" />
                            </View>
                        ) : null}
                    </>
                }
                ListEmptyComponent={
                    !loadingSearch ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>{mode === "threads" ? "No threads found." : "No replies found."}</Text>
                        </View>
                    ) : null
                }
                ListFooterComponent={
                    loadingMore ? (
                        <View style={styles.footerLoader}>
                            <ActivityIndicator size="large" color="green" />
                            <Text style={{ color: "green" }}>
                                {mode === "threads" ? "Loading more threads..." : "Loading more replies..."}
                            </Text>
                        </View>
                    ) : null
                }
                renderItem={({ item }) => {
                    if (item.kind === "thread") {
                        const thread = item.thread;
                        return (
                            <ProfileThreadCard
                                thread={thread}
                                onPress={() =>
                                    onOpenThread({
                                        threadId: thread.id,
                                        sourceActivityMode: "threads",
                                        onThreadUpdated: ({ threadId, likedByMe, likeCount, replyCount, title, body }) => {
                                            setThreads((prev) =>
                                                prev.map((t) => {
                                                    if (t.id !== threadId) return t;
                                                    return {
                                                        ...t,
                                                        likedByMe: likedByMe ?? t.likedByMe,
                                                        likeCount: likeCount ?? t.likeCount,
                                                        replyCount: replyCount ?? t.replyCount,
                                                        title: title ?? t.title,
                                                        body: body ?? t.body,
                                                    };
                                                })
                                            );
                                        },
                                        onThreadDeleted: (threadId) => {
                                            setThreads((prev) => prev.filter((t) => t.id !== threadId));
                                        },
                                        onReplyUpdated: undefined,
                                    })
                                }
                                onLikeUpdated={({ threadId, likedByMe, likeCount }) => {
                                    setThreads((prev) =>
                                        prev.map((t) =>
                                            t.id === threadId ? { ...t, likedByMe, likeCount } : t
                                        )
                                    );
                                }}
                                onThreadEdited={({ threadId, title, body }) => {
                                    setThreads((prev) =>
                                        prev.map((t) =>
                                            t.id === threadId ? { ...t, title, body } : t
                                        )
                                    );
                                }}
                                onThreadDeleted={async (threadId) => {
                                    try {
                                        const res = await deleteThreadApi(threadId);
                                        setThreads((prev) => prev.filter((t) => t.id !== threadId));
                                        setFeedback({
                                            text: res.message ?? "Thread deleted.",
                                            success: true,
                                        });
                                    } catch (e: any) {
                                        setFeedback({
                                            text: e?.message ?? "Delete thread failed.",
                                            success: false,
                                        });
                                    }
                                }}
                                onAuthorPress={onOpenUserProfile}
                                showEditedLabel={showEditedLabel}
                            />
                        );
                    }

                    const reply = item.reply;

                    return (
                        <ProfileReplyCard
                            reply={reply}
                            onLikeUpdated={({ replyId, likedByMe, likeCount }) => {
                                setReplies((prev) =>
                                    prev.map((r) =>
                                        r.id === replyId ? { ...r, likedByMe, likeCount } : r
                                    )
                                );
                            }}
                            onOpenThread={(threadId) =>
                                onOpenThread({
                                    threadId,
                                    sourceActivityMode: "replies",
                                    onThreadUpdated: () => { },
                                    onThreadDeleted: () => { },
                                    onReplyUpdated: ({ replyId, likedByMe, likeCount, body, updatedAt, deleted }) => {
                                        if (deleted) {
                                            setReplies((prev) => prev.filter((r) => r.id !== replyId));
                                            return;
                                        }

                                        setReplies((prev) =>
                                            prev.map((r) =>
                                                r.id === replyId
                                                    ? {
                                                        ...r,
                                                        likedByMe: likedByMe ?? r.likedByMe,
                                                        likeCount: likeCount ?? r.likeCount,
                                                        body: body ?? r.body,
                                                        updatedAt: updatedAt ?? r.updatedAt,
                                                    }
                                                    : r
                                            )
                                        );
                                    },
                                })
                            }
                            onEdited={(nextReply) => {
                                setReplies((prev) =>
                                    prev.map((r) =>
                                        r.id === nextReply.id
                                            ? {
                                                ...r,
                                                body: nextReply.body,
                                                updatedAt: nextReply.updatedAt,
                                            }
                                            : r
                                    )
                                );
                            }}
                            onDeleted={async (replyId) => {
                                try {
                                    const res = await deleteReplyApi(replyId);
                                    setReplies((prev) => prev.filter((r) => r.id !== replyId));
                                    setFeedback({
                                        text: res.message ?? "Reply deleted.",
                                        success: true,
                                    });
                                } catch (e: any) {
                                    setFeedback({
                                        text: e?.message ?? "Delete reply failed.",
                                        success: false,
                                    });
                                }
                            }}
                            onAuthorPress={onOpenUserProfile}
                            showEditedLabel={true}
                        />
                    );
                }}
            />

            <FeedbackModal
                visible={Boolean(feedback)}
                message={feedback?.text}
                success={feedback?.success}
                onClose={() => setFeedback(null)}
            />
        </View>
    );
}
