import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from './styles';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { ThreadsParamList } from "../../../navigation/ThreadsNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BackButton from "../../../components/buttons/BackButton";
import { useEffect, useMemo, useState } from "react";
import SearchBar from "../../../components/common/search-bar/SearchBar";
import { getAllThreadsApi } from "../../../services/api/threads/getAllThreadsApi";
import ThreadCard from "../../../components/threads/threads-main/thread-card/ThreadCard";
import { ThreadType } from "../../../libs/types/threads/ThreadType";
import { FlatList } from "react-native-gesture-handler";
import Error from "../../../components/Error";
import { getAllProfilesApi } from "../../../services/api/profiles/getAllProfilesApi";
import { ProfileType } from "../../../libs/types/profiles/ProfileType";
import SearchFilters from "../../../components/threads/threads-search/search-filters/SearchFilters";
import { SearchModeType } from "../../../libs/types/threads/SearchModeType";
import ProfileCard from "../../../components/threads/threads-search/profile-card.ts/ProfileCard";

type Props = NativeStackScreenProps<ThreadsParamList, "ThreadsSearch">;

type SearchListItem =
    | { kind: "thread"; id: number; thread: ThreadType }
    | { kind: "profile"; id: number; profile: ProfileType };

export default function ThreadsSearchScreen({ navigation }: Props) {
    const [query, setQuery] = useState("");
    const [mode, setMode] = useState<SearchModeType>("threads");

    const [threads, setThreads] = useState<ThreadType[]>([]);
    const [profiles, setProfiles] = useState<ProfileType[]>([]);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const removeDuplicateThreadsById = (items: ThreadType[]) => {
        const seen = new Set<number>();
        return items.filter((thread) => {
            if (seen.has(thread.id)) return false;
            seen.add(thread.id);
            return true;
        });
    };

    const removeDuplicateProfilesById = (items: ProfileType[]) => {
        const seen = new Set<number>();
        return items.filter((profile) => {
            if (seen.has(profile.id)) return false;
            seen.add(profile.id);
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

            const res = await getAllThreadsApi({
                page: nextPage,
                limit: 10,
                query: query.trim() || undefined,
            });

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

    const fetchProfiles = async (opts?: { reset?: boolean; pageOverride?: number }) => {
        const reset = opts?.reset ?? false;
        const nextPage = opts?.pageOverride ?? (reset ? 1 : page);

        if (reset) setLoadingSearch(true);
        else setLoadingMore(true);

        try {
            setError(null);

            const res = await getAllProfilesApi({
                page: nextPage,
                limit: 10,
                query: query.trim() || undefined,
            });

            setTotalPages(res.totalPages);

            if (reset) {
                setProfiles(removeDuplicateProfilesById(res.items));
                setPage(1);
            } else {
                setProfiles((prev) => removeDuplicateProfilesById([...prev, ...res.items]));
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
        else await fetchProfiles({ reset: false, pageOverride: page + 1 });
    };

    useEffect(() => {
        const t = setTimeout(() => {
            if (mode === "threads") {
                fetchThreads({ reset: true });
            } else {
                fetchProfiles({ reset: true });
            }
        }, 350);

        return () => clearTimeout(t);
    }, [query, mode]);

    const listThreadsOrProfiles = useMemo<SearchListItem[]>(() => {
        if (mode === "threads") {
            return threads.map((thread) => ({ kind: "thread", id: thread.id, thread }));
        }

        return profiles.map((profile) => ({ kind: "profile", id: profile.id, profile }));
    }, [mode, threads, profiles]);

    if (error) return <Error navigation={navigation} error={error} />;

    return (
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
            <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}>

                <BackButton navigation={navigation} />

                <View style={styles.container}>
                    <Text style={styles.title}>Search</Text>

                    <SearchBar
                        query={query}
                        setQuery={setQuery}
                        placeholder={mode === "threads" ? "Search threads..." : "Search profiles..."}
                    />

                    <SearchFilters
                        onPressThreads={() => {
                            if (mode === "threads") return;
                            setMode("threads");
                            setPage(1);
                        }}
                        onPressProfiles={() => {
                            if (mode === "profiles") return;
                            setMode("profiles");
                            setPage(1);
                        }}
                        mode={mode}
                    />
                </View>

                <FlatList<SearchListItem>
                    data={listThreadsOrProfiles}
                    style={{ flex: 1 }}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    ListHeaderComponent={
                        loadingSearch ? (
                            <View style={styles.headerLoader}>
                                <ActivityIndicator size="large" color="green" />
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={
                        !loadingSearch ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>{mode === "threads" ? "No threads found." : "No profiles found."}</Text>
                            </View>
                        ) : null
                    }
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.4}
                    ListFooterComponent={
                        loadingMore ? (
                            <View style={styles.footerLoader}>
                                <ActivityIndicator size="large" color="green" />
                                <Text style={{ color: "green" }}>
                                    {mode === "threads" ? "Loading more threads..." : "Loading more profiles..."}
                                </Text>
                            </View>
                        ) : null
                    }
                    renderItem={({ item }) => {
                        if (item.kind === "thread") {
                            const thread = item.thread;

                            return (
                                <ThreadCard
                                    thread={thread}
                                    onPress={() =>
                                        navigation.navigate("ThreadDetails", {
                                            threadId: thread.id,
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
                                        })
                                    }
                                    onAuthorPress={(userId) => navigation.getParent()?.navigate("Profile", { screen: "UserProfile", params: { userId, source: "threadsSearch" } })}
                                />
                            );
                        }

                        const profile = item.profile;

                        return (
                            <ProfileCard
                                onPress={() => navigation.getParent()?.navigate("Profile", { screen: "UserProfile", params: { userId: profile.id, source: "threadsSearch" } })}
                                avatarFileName={profile.avatarFileName}
                                username={profile.username}
                            />
                        );
                    }}
                />

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

