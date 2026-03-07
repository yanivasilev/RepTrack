import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import Stats from "./stats/Stats";

type SummaryCardProps = {
    reps: number;
    goodReps: number;
    badReps: number;
}

export function SummaryCard({ reps, goodReps, badReps }: SummaryCardProps) {
    return (
        <View style={styles.card} >
            <Text style={styles.title}>SUMMARY</Text>

            <View style={styles.container}>
                <Stats label="REPS" value={reps} />
                <Stats label="GOOD" value={goodReps} good />
                <Stats label="NEEDS WORK" value={badReps} warn />
            </View>
        </View>
    );
}
