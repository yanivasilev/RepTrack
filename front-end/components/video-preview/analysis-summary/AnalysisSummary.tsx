import React from "react";
import { View, Text } from "react-native";
import { SummaryCard } from "../summary-card/SummaryCard";
import { Status } from "../status/Status";
import { styles } from "./styles";

type AnalysisProps = {
    analysis: {
        reps: number;
        goodReps: number;
        badReps: number;
        feedback: { code: string; message: string };
        repFeedbacks: Array<{ repIndex: number; code: string; message: string; tStart: number; tEnd: number }>;
        timingsMs: { total: number };
    };
}

export default function AnalysisSummary({ analysis }: AnalysisProps) {
    return (
        <View style={styles.gap}>
            {/* STATUS CODES AND FEEDBACK MESSAGES */}
            <Status code={analysis.feedback.code} message={analysis.feedback.message} />

            {/* SUMMARY CARD */}
            {analysis.reps > 0 && <SummaryCard reps={analysis.reps} goodReps={analysis.goodReps} badReps={analysis.badReps} />}

            {/* REP-BY-REP FEEDBACK */}
            {analysis.repFeedbacks.length > 0 && (
                <View style={styles.gap}>
                    <Text style={styles.title}>REP-BY-REP FEEDBACK</Text>

                    {analysis.repFeedbacks.map((rep) => {
                        const dur = rep.tEnd - rep.tStart;

                        return (
                            <View key={rep.repIndex} style={styles.repFeedbackCard}>
                                <Text style={[styles.text, { marginBottom: 5 }]}>
                                    Rep #{rep.repIndex}
                                </Text>

                                <Status code={rep.code} message={rep.message} />

                                <Text style={styles.text2}>
                                    Duration: <Text style={styles.text}>{dur.toFixed(2)}s</Text> ·
                                    Start: <Text style={styles.text}>{rep.tStart.toFixed(2)}s</Text> ·
                                    End: <Text style={styles.text}>{rep.tEnd.toFixed(2)}s</Text>
                                </Text>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
}