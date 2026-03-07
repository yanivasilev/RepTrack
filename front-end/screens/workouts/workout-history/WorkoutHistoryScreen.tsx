import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BackButton from "../../../components/buttons/BackButton";
import { useEffect, useState } from "react";
import DateFilter from "../../../components/workouts/workout-history/date-filter/DateFilter";
import SortSelector from "../../../components/workouts/workout-history/sort-selector/SortSelector";
import { workoutHistoryApi } from "../../../services/api/workouts/workoutHistoryApi";
import { WorkoutHistoryItemType } from "../../../libs/types/workouts/WorkoutHistoryItemType";
import WorkoutCard from "../../../components/workouts/workout-history/workout-card/WorkoutCard";
import { WorkoutsParamList } from "../../../navigation/WorkoutsNavigator";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";

type Props = NativeStackScreenProps<WorkoutsParamList, "WorkoutHistory">;

export default function WorkoutHistoryScreen({ navigation }: Props) {
    const [from, setFrom] = useState<Date | undefined>();
    const [to, setTo] = useState<Date | undefined>();
    const [sort, setSort] = useState<string>("latest");
    const [openPicker, setOpenPicker] = useState<"from" | "to" | null>(null);

    const today = new Date();

    const [page, setPage] = useState(1);
    const limit = 10;

    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadMore, setLoadMore] = useState(true);

    const [sessions, setSessions] = useState<WorkoutHistoryItemType[]>([]);
    const hasActiveFilters = !!from || !!to || sort !== "latest";

    // RESETS WORKOUT HISTORY WHEN FILTER CHANGE
    useEffect(() => {
        setPage(1);
        setSessions([]);
        setLoadMore(true);
    }, [from?.toISOString(), to?.toISOString(), sort]);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!loadMore && page !== 1) return;

            const isFirstPage = page === 1;

            if (isFirstPage) setLoading(true);
            else setLoadingMore(true);

            setError(null);

            try {
                const res = await workoutHistoryApi({ page, limit, from, to, sort });
                if (cancelled) return;

                const rawItems = res.items;
                const totalPages = res.totalPages;

                setSessions((prev) => (page === 1 ? rawItems : [...prev, ...rawItems]));

                if (typeof totalPages === "number") {
                    setLoadMore(page < totalPages);
                } else {
                    setLoadMore(rawItems.length === limit);
                }
            } catch (e: any) {
                if (!cancelled) setError(e?.message ?? "Failed to load history.");
            } finally {
                if (cancelled) return;
                if (isFirstPage) setLoading(false);
                else setLoadingMore(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [page, limit, from?.toISOString(), to?.toISOString(), sort]);

    if (loading && page === 1) return <Loading message="Loading workout history..." />;

    if (error && page === 1 && sessions.length === 0) return <Error navigation={navigation} error={error ?? "Something went wrong."} />;

    return (
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
            <View style={styles.root}>

                {/* BACK BUTTON */}
                <BackButton navigation={navigation} />

                <View style={styles.topContainer}>

                    {/* TITLE */}
                    <Text style={styles.title}>Workout History</Text>

                    <DateFilter
                        label="From"
                        value={from}
                        onChange={(d) => {
                            setFrom(d);
                            if (to && d > to) setTo(d);
                        }}
                        onClear={() => setFrom(undefined)}
                        isOpen={openPicker === "from"}
                        onOpen={() => setOpenPicker("from")}
                        onClose={() => setOpenPicker(null)}
                        maximumDate={today}
                    />

                    <DateFilter
                        label="To"
                        value={to}
                        onChange={setTo}
                        onClear={() => setTo(undefined)}
                        isOpen={openPicker === "to"}
                        onOpen={() => setOpenPicker("to")}
                        onClose={() => setOpenPicker(null)}
                        minimumDate={from}
                        maximumDate={today}
                    />

                    <SortSelector
                        value={sort}
                        onChange={setSort}
                    />
                </View>

                <FlatList<WorkoutHistoryItemType>
                    data={sessions}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={() => { if (!loadingMore && loadMore) setPage(p => p + 1) }}
                    onEndReachedThreshold={0.4}
                    contentContainerStyle={{ gap: 10, paddingBottom: 10 }}
                    ListEmptyComponent={
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ color: "gray", textAlign: "center" }}>
                                {hasActiveFilters
                                    ? "No workouts match your filters."
                                    : "No workouts yet. Start your first workout."}
                            </Text>
                        </View>
                    }
                    ListFooterComponent={
                        loadingMore && loadMore ? (
                            <View style={{ paddingVertical: 16, alignItems: "center", gap: 8 }}>
                                <ActivityIndicator size="large" color="green" />
                                <Text style={{ color: "green" }}>Loading more workouts...</Text>
                            </View>
                        ) : null
                    }
                    renderItem={({ item }) => (
                        <WorkoutCard
                            startedAt={new Date(item.startedAt)}
                            durationSeconds={item.durationSeconds}
                            exerciseCount={item.exerciseCount}
                            setCount={item.setCount}
                            notes={item.notes}
                            onPress={() => navigation.navigate("WorkoutDetails", { id: item.id })}
                        />
                    )}
                />

            </View>
        </SafeAreaView>
    );
}
