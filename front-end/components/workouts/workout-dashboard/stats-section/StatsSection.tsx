import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { styles } from "./styles";
import { WorkoutStatsResponseType } from "../../../../libs/types/workouts/workout-dashboard/WorkoutStatsResponseType";
import { TimeFrameType } from "../../../../libs/types/workouts/workout-dashboard/TimeFrameType";
import StatsCard from "../stats-card/StatsCard";
import { formatSeconds } from "../../../../libs/helpers/time/formatSeconds";
import { convertWeight } from "../../../../libs/helpers/convertWeight";

type StatsSectionProps = {
    data: WorkoutStatsResponseType;
};

export default function StatsSection({ data }: StatsSectionProps) {
    const [period, setPeriod] = useState<TimeFrameType>("last7d");

    const stats = data[period];
    const streaks = data.streaks;
    const weightUnitType = data.user.weightUnitType;
    const hasPeriodData = stats.workoutsCount > 0;
    const hasAnyHistory = data.allTime.workoutsCount > 0;

    const formatWeightVolume = (kg?: number) => {
        const rawKg = kg ?? 0;
        const value = weightUnitType === "IMPERIAL" ? convertWeight(rawKg, "METRIC", "IMPERIAL") : rawKg;
        const unit = weightUnitType === "IMPERIAL" ? "lb" : "kg";

        if (value >= 1000) return `${(value / 1000).toFixed(1)}k ${unit}`;
        return `${Math.round(value)} ${unit}`;
    };

    return (
        <View style={{ gap: 10 }}>
            <Text style={styles.title}>PERFORMANCE OVERVIEW</Text>

            <View style={styles.grid}>
                <StatsCard label={"Total Workouts"} value={hasPeriodData ? String(stats.workoutsCount) : "-"} />
                <StatsCard label={"Exercises"} value={hasPeriodData ? String(stats.totalExercises) : "-"} />
            </View>

            <View style={styles.grid}>
                <StatsCard label={"Total sets"} value={hasPeriodData ? String(stats.totalSets) : "-"} />
                <StatsCard label={"Weight Volume"} value={hasPeriodData ? formatWeightVolume(stats.totalVolumeKg) : "-"} />
            </View>

            <View style={styles.grid}>
                <StatsCard label={"Reps"} value={hasPeriodData ? String(stats.totalReps) : "-"} />
                <StatsCard label={"Time spent"} value={hasPeriodData ? formatSeconds(stats.trainingTimeSeconds) : "-"} />
            </View>

            <View style={styles.grid}>
                <StatsCard label="Current Streak" value={hasAnyHistory ? `${streaks.currentStreakDays} days` : "-"} />
                <StatsCard label="Best Streak" value={hasAnyHistory ? `${streaks.bestStreakDays} days` : "-"} />
            </View>

            <View style={styles.period}>
                {(["last7d", "last30d", "last365d", "allTime"] as const).map((p) => (
                    <Pressable
                        key={p}
                        onPress={() => setPeriod(p)}
                        style={({ pressed }) => ({
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            borderRadius: 999,
                            borderWidth: 1,
                            borderColor: pressed ? "darkgreen" : "green",
                            backgroundColor: period === p
                                ? pressed
                                    ? "darkgreen"
                                    : "green"
                                : pressed
                                    ? "#f3f4f6"
                                    : "white",
                        })}
                    >
                        <Text style={{ fontWeight: "800", color: period === p ? "white" : "green" }}>
                            {p === "last7d" ? "7 days" : p === "last30d" ? "30 days" : p === "last365d" ? "365 days" : "All time"}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}
