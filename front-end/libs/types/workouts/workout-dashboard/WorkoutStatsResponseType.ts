import { UnitType } from "../../common/UnitType";
import { ChartKitDataType } from "./ChartKitDataType";
import { ChartTimeFrameType } from "./ChartTimeFrameType";
import { MetricType } from "./MetricType";
import { WorkoutStatsType } from "./WorkoutStatsType";

export type WorkoutStatsResponseType = {
    last7d: WorkoutStatsType;
    last30d: WorkoutStatsType;
    last365d: WorkoutStatsType;
    allTime: WorkoutStatsType;
    streaks: {
        currentStreakDays: number;
        bestStreakDays: number;
    };
    charts: Record<MetricType, Record<ChartTimeFrameType, ChartKitDataType>>;
    user: {
        weightUnitType: UnitType;
    };
};
