import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";

type SummaryCardProps = {
    reps: number;
    goodReps: number;
    badReps: number;
}

export function SummaryCard({ reps, goodReps, badReps }: SummaryCardProps) {
    return (
        <View style={styles.card} >
            <Text style={styles.title}>SUMMARY</Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
                <Stat label="REPS" value={reps} />
                <Stat label="GOOD" value={goodReps} good />
                <Stat label="NEEDS WORK" value={badReps} warn />
            </View>
        </View>
    );
}

function Stat({ label, value, good, warn }: { label: string; value: number; good?: boolean; warn?: boolean }) {
    const bg = good ? "#DCFCE7" : warn ? "#FEF3C7" : "#F3F4F6";
    const fg = good ? "#166534" : warn ? "#92400E" : "#111827";

    return (
        <View
            style={{
                flex: 1,
                borderRadius: 14,
                padding: 12,
                backgroundColor: bg,
            }}
        >
            <Text style={{ color: "#6B7280", fontWeight: "800", fontSize: 12 }}>{label}</Text>
            <Text style={{ color: fg, fontWeight: "900", fontSize: 22, marginTop: 4 }}>{value}</Text>
        </View>
    );
}
