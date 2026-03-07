import React, { useCallback, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { WorkoutsParamList } from "../../../navigation/WorkoutsNavigator";
import Button from "../../../components/buttons/Button";
import { useFocusEffect } from "@react-navigation/native";
import { workoutStatsApi } from "../../../services/api/workouts/workoutStatsApi";
import { WorkoutStatsResponseType } from "../../../libs/types/workouts/workout-dashboard/WorkoutStatsResponseType";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import StatsSection from "../../../components/workouts/workout-dashboard/stats-section/StatsSection";
import ChartsCard from "../../../components/workouts/workout-dashboard/charts-card/ChartsCard";
import { useWorkout } from "../../../hooks/WorkoutSessionContext";

type Props = NativeStackScreenProps<WorkoutsParamList, "WorkoutDashboard">;

export default function WorkoutDashboardScreen({ navigation }: Props) {
    const { session } = useWorkout();
    const [data, setData] = useState<WorkoutStatsResponseType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await workoutStatsApi();
            setData(res);
        } catch (error: any) {
            setError(error?.message ?? "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchStats();
        }, [fetchStats])
    );

    if (loading) return <Loading message="Loading workout dashboard..." />;

    if (error || !data) return <Error error={error ?? "Something went wrong."} />;

    return (
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
            <View style={styles.root}>
                <View style={{ paddingHorizontal: 16, paddingTop: 8, gap: 10, flex: 1 }}>
                    {/* TITLE */}
                    <Text style={styles.title}>Workout Dashboard</Text>

                    <ScrollView
                        contentContainerStyle={{ paddingTop: 8, gap: 14, paddingBottom: 140 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* STATS SECTION */}
                        <StatsSection data={data} />

                        {/* CHARTS SECTION */}
                        <Text style={{ color: "green", fontWeight: "900", fontSize: 18 }}>PROGRESS TRACKING</Text>

                        <ChartsCard data={data} label="Workouts over time" metric="workouts" initialPeriod="last7d" />
                        <ChartsCard data={data} label="Time spent over time" metric="durationSeconds" initialPeriod="last7d" />
                        <ChartsCard data={data} label="Weight Volume over time" metric="volumeKg" initialPeriod="last7d" />
                    </ScrollView>

                    {/* BUTTONS */}
                    <View style={styles.bottom}>
                        <Button label={session ? "CONTINUE WORKOUT" : "START WORKOUT"} onPress={() => navigation.navigate("WorkoutStart")} />
                        <Button label="WORKOUT HISTORY" variant="outlined" onPress={() => navigation.navigate("WorkoutHistory")} />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
