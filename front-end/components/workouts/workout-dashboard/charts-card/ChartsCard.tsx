import React, { useMemo, useState } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { styles } from "./styles";
import { WorkoutStatsResponseType } from "../../../../libs/types/workouts/workout-dashboard/WorkoutStatsResponseType";
import { ChartTimeFrameType } from "../../../../libs/types/workouts/workout-dashboard/ChartTimeFrameType";
import { MetricType } from "../../../../libs/types/workouts/workout-dashboard/MetricType";
import { UnitType } from "../../../../libs/types/common/UnitType";
import { convertWeight } from "../../../../libs/helpers/convertWeight";

type Props = {
    data: WorkoutStatsResponseType;
    label: string;
    metric: MetricType;
    initialPeriod?: ChartTimeFrameType;
};

const periodOptions: ChartTimeFrameType[] = ["last7d", "last30d", "last365d"];

function periodLabel(p: ChartTimeFrameType) {
    return p === "last7d" ? "7 days" : p === "last30d" ? "30 days" : "365 days";
}

function formatYAxisLabel(raw: string, metric: MetricType, weightUnitType: UnitType) {
    const value = Number(raw);
    if (!Number.isFinite(value)) return raw;

    if (metric === "durationSeconds") {
        if (value >= 60) {
            const hours = value / 60;
            return `${hours.toFixed(hours >= 10 ? 0 : 1)}h`;
        }
        return `${Math.round(value)}m`;
    }

    if (metric === "volumeKg") {
        const unit = weightUnitType === "IMPERIAL" ? "lb" : "kg";
        if (value >= 1000) return `${(value / 1000).toFixed(1)}k ${unit}`;
        return `${Math.round(value)} ${unit}`;
    }

    return `${Math.round(value)}`;
}

export default function ChartsCard({ data, label, metric, initialPeriod = "last7d" }: Props) {
    const { width } = useWindowDimensions();

    const [period, setPeriod] = useState<ChartTimeFrameType>(initialPeriod);

    const chartWidth = width - 48;

    const chartData = useMemo(() => {
        const base = data?.charts?.[metric]?.[period];
        if (!base) return null;

        if (metric === "durationSeconds") {
            return {
                ...base,
                datasets: [{ data: base.datasets[0].data.map((s) => Math.round(s / 60)) }],
            };
        }

        if (metric === "volumeKg" && data.user.weightUnitType === "IMPERIAL") {
            return {
                ...base,
                datasets: [{ data: base.datasets[0].data.map((kg) => convertWeight(kg, "METRIC", "IMPERIAL")) }],
            };
        }

        return base;
    }, [data, metric, period]);

    const hasChartData = useMemo(() => {
        if (!chartData) return false;
        const values = chartData.datasets?.[0]?.data ?? [];
        return values.some((value) => value > 0);
    }, [chartData]);

    return (
        <View style={styles.card}>

            {/* LABEL */}
            <Text style={styles.label}>{label}</Text>

            {chartData && hasChartData ? (
                <View style={styles.chartCard}>

                    {/* CHART */}
                    <LineChart
                        data={chartData}
                        width={chartWidth}
                        height={220}
                        verticalLabelRotation={45}
                        xLabelsOffset={-5}
                        fromZero
                        withDots={false}
                        withInnerLines={false}
                        withOuterLines={false}
                        segments={4}
                        formatYLabel={(yLabel) => formatYAxisLabel(yLabel, metric, data.user.weightUnitType)}
                        chartConfig={{
                            backgroundColor: "#F6F6F6",
                            backgroundGradientFrom: "#F6F6F6",
                            backgroundGradientTo: "#F6F6F6",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
                            labelColor: () => "#16a34a",
                            propsForBackgroundLines: { strokeWidth: 0 },
                        }}
                    />
                </View>
            ) : (
                <Text style={styles.textNoData}>No data</Text>
            )}

            {/* PERIOD TOGGLE BUTTONS */}
            <View style={styles.period}>
                {periodOptions.map((p) => (
                    <Pressable
                        key={p}
                        onPress={() => setPeriod(p)}
                        style={({ pressed }) => ({
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            borderRadius: 999,
                            borderWidth: 1,
                            borderColor: "green",
                            backgroundColor:
                                p === period
                                    ? pressed
                                        ? "darkgreen"
                                        : "green"
                                    : pressed
                                        ? "#f3f4f6"
                                        : "#F6F6F6",
                        })}
                    >
                        <Text style={{ fontWeight: "800", color: p === period ? "white" : "green" }}>
                            {periodLabel(p)}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}
