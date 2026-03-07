import { ChartKitData } from "./types/ChartKitData";
import { Point } from "./types/Point";

export function toChartKitData(points: Point[], labelEvery: number): ChartKitData {
    const labels = points.map((point, index) => {
        if (index % labelEvery !== 0) return "";
        return point.label;
    });

    return {
        labels,
        datasets: [{ data: points.map((point) => point.value) }],
    };
}