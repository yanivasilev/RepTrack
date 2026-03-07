import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from './styles';
import { useCallback, useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import ThreadCard from "../../../components/threads/threads-main/thread-card/ThreadCard";
import { ThreadType } from "../../../libs/types/threads/ThreadType";
import { getAllThreadsApi } from "../../../services/api/threads/getAllThreadsApi";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import { FlatList } from "react-native-gesture-handler";
import { ThreadsParamList } from "../../../navigation/ThreadsNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CreateThread from "../../../components/threads/threads-main/create-thread/CreateThread";
import { createThreadApi } from "../../../services/api/threads/createThreadApi";
import { Paginated } from "../../../libs/types/Paginated";
import SearchButton from "../../../components/threads/threads-main/SearchButton";
import { useFocusEffect } from "@react-navigation/native";
import FeedbackModal from "../../../components/FeedbackModal";
import { QuoteType } from "../../../libs/types/QuoteType";
import { useAuth } from "../../../hooks/authContext";
import { getQuote } from "../../../libs/helpers/quotes/getQuote";

type Props = NativeStackScreenProps<ThreadsParamList, "ThreadsMain">;

export default function ThreadsMainScreen({ navigation }: Props) {
    const { user } = useAuth();
    const [threads, setThreads] = useState<Paginated<ThreadType> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);
    const [quote, setQuote] = useState<QuoteType | null>(getQuote(user?.id));

    const removeDuplicateThreadsById = (threads: ThreadType[]) => {
        const seen = new Set<number>();

        return threads.filter((thread) => {
            if (seen.has(thread.id)) return false;
            seen.add(thread.id);
            return true;
        });
    };

    const loadMoreThreads = async () => {
        if (loadingMore) return;
        if (!threads) return;

        const hasMoreThreads = threads.page < threads.totalPages;
        if (!hasMoreThreads) return;

        setLoadingMore(true);
        try {
            const nextPage = threads.page + 1;
            const res = await getAllThreadsApi({ page: nextPage, limit: threads.limit });

            setThreads((prev) =>
                prev ? {
                    ...prev,
                    page: res.page,
                    limit: res.limit,
                    total: res.total,
                    totalPages: res.totalPages,
                    items: removeDuplicateThreadsById([...prev.items, ...res.items]),
                } : {
                    page: res.page,
                    limit: res.limit,
                    total: res.total,
                    totalPages: res.totalPages,
                    items: removeDuplicateThreadsById(res.items),
                }
            );
        } catch (e) {
            // ADD ERROR LATER
        } finally {
            setLoadingMore(false);
        }
    };

    const fetchThreads = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await getAllThreadsApi({ page: 1, limit: 10 });
            setThreads({
                page: res.page,
                limit: res.limit,
                total: res.total,
                totalPages: res.totalPages,
                items: removeDuplicateThreadsById(res.items),
            });
        } catch (error: any) {
            setError(error?.message ?? "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchThreads();
            setQuote(getQuote(user?.id));
        }, [fetchThreads, user?.id])
    );

    if (loading) return <Loading message="Loading threads..." />

    if (error || !threads) return <Error error={error ?? "Something went wrong."} />

    return (
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
            <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}>

                <SearchButton onPress={() => navigation.navigate("ThreadsSearch")} />

                {/* TITLE */}
                <Text style={styles.title}>Threads</Text>

                {/* DAILY MOTIVATIONAL QUOTE */}
                <View style={styles.quoteContainer}>
                    <Text style={styles.quoteTitle}>
                        DAILY MOTIVATIONAL QUOTE
                    </Text>
                    <Text style={styles.quoteText}>
                        "{quote?.quote ?? "There are no limits. There are only plateaus, and you must not stay there, you must go beyond them."}"
                    </Text>
                    <Text style={styles.quoteAuthor}>
                        - {quote?.author ?? "Bruce Lee"}
                    </Text>
                    <Text style={styles.quoteAttribution}>
                        Quotes data provided by QuoteSlate (MIT License).
                    </Text>
                </View>

                <View style={styles.root}>
                    <FlatList<ThreadType>
                        data={threads.items}
                        style={{ flex: 1 }}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.container}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    No threads yet. Be the first one!
                                </Text>
                            </View>
                        }
                        onEndReached={loadMoreThreads}
                        onEndReachedThreshold={0.4}
                        ListFooterComponent={loadingMore ? <Loading message="Loading threads..." /> : null}
                        renderItem={({ item }) => (
                            <ThreadCard
                                thread={item}
                                onPress={() =>
                                    navigation.navigate("ThreadDetails", {
                                        threadId: item.id,
                                        onThreadUpdated: ({ threadId, likedByMe, likeCount, replyCount, title, body }) => {
                                            setThreads((prev) =>
                                                prev ? {
                                                    ...prev,
                                                    items: prev.items.map((t) => {
                                                        if (t.id !== threadId) return t;

                                                        return {
                                                            ...t,
                                                            likedByMe: likedByMe ?? t.likedByMe,
                                                            likeCount: likeCount ?? t.likeCount,
                                                            replyCount: replyCount ?? t.replyCount,
                                                            title: title ?? t.title,
                                                            body: body ?? t.body,
                                                        };
                                                    }),
                                                } : prev
                                            );
                                        },
                                        onThreadDeleted: (threadId) => {
                                            setThreads((prev) => {
                                                if (!prev) return prev;

                                                const nextItems = prev.items.filter((t) => t.id !== threadId);
                                                if (nextItems.length === prev.items.length) return prev;

                                                return {
                                                    ...prev,
                                                    items: nextItems,
                                                    total: Math.max(0, prev.total - 1),
                                                };
                                            });
                                        }
                                    })
                                }
                                onAuthorPress={(userId) => navigation.getParent()?.navigate("Profile", { screen: "UserProfile", params: { userId, source: "threads" } })}
                            />
                        )}
                    />

                    <CreateThread
                        onSubmit={async ({ title, body }) => {
                            try {
                                const created = await createThreadApi(title, body);

                                const refreshed = await getAllThreadsApi();
                                setThreads({
                                    page: refreshed.page,
                                    limit: refreshed.limit,
                                    total: refreshed.total,
                                    totalPages: refreshed.totalPages,
                                    items: removeDuplicateThreadsById(refreshed.items),
                                });

                                setFeedback({
                                    text: created.message ?? "Thread created.",
                                    success: true,
                                });
                            } catch (e: any) {
                                setFeedback({
                                    text: e?.message ?? "Creating thread failed.",
                                    success: false,
                                });
                                throw e;
                            }
                        }}
                    />
                </View>
            </KeyboardAvoidingView>

            <FeedbackModal
                visible={Boolean(feedback)}
                message={feedback?.text}
                success={feedback?.success}
                onClose={() => setFeedback(null)}
            />
        </SafeAreaView>
    );
}
