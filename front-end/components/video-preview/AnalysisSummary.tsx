import React from "react";
import { View, Text } from "react-native";
import { SummaryCard } from "./summary-card/SummaryCard";
import { Status } from "./status/Status";
import { VideoPreviewCodeStyles } from "../../libs/helpers/VideoPreviewCodeStyles";

export function AnalysisSummary({ analysis }: {
    analysis: {
        reps: number;
        goodReps: number;
        badReps: number;
        feedback: { code: string; message: string };
        repFeedbacks: Array<{ repIndex: number; code: string; message: string; tStart: number; tEnd: number }>;
        timingsMs: { total: number };
    };
}) {
    return (
        <View style={{ gap: 14 }}>

            {/* STATUS CODES AND FEEDBACK MESSAGES */}
            <Status code={analysis.feedback.code} message={analysis.feedback.message} />

            {/* SUMMARY CARD */}
            {analysis.reps > 0 && (
                <SummaryCard reps={analysis.reps} goodReps={analysis.goodReps} badReps={analysis.badReps} />
            )}

            {/* REP-BY-REP FEEDBACK */}
            {analysis.repFeedbacks.length > 0 && (
                <View style={{ gap: 10 }}>
                    <Text style={{ fontWeight: "900", color: "green" }}>REP-BY-REP FEEDBACK</Text>

                    {analysis.repFeedbacks.map((rep) => {
                        const s = VideoPreviewCodeStyles(rep.code);
                        const dur = rep.tEnd - rep.tStart;

                        return (
                            <View
                                key={rep.repIndex}
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: 16,
                                    padding: 12,
                                    borderWidth: 1,
                                    borderColor: "green",
                                    gap: 8,
                                }}
                            >
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <Text style={{ fontWeight: "900", color: "green" }}>
                                        Rep #{rep.repIndex}
                                    </Text>

                                    <View
                                        style={{
                                            paddingHorizontal: 10,
                                            paddingVertical: 6,
                                            borderRadius: 999,
                                            backgroundColor: s.bg,
                                            borderWidth: 1,
                                            borderColor: s.border,
                                        }}
                                    >
                                        <Text style={{ color: s.fg, fontWeight: "900", fontSize: 12 }}>
                                            {rep.code.replace(/_/g, " ")}
                                        </Text>
                                    </View>
                                </View>

                                <Text style={{ color: s.fg, fontWeight: "500" }}>{rep.message}</Text>

                                <Text style={{ color: "#6B7280", fontSize: 12 }}>
                                    Duration: <Text style={{ fontWeight: "900", color: "green" }}>{dur.toFixed(2)}s</Text> ·
                                    Start: <Text style={{ fontWeight: "900", color: "green" }}>{rep.tStart.toFixed(2)}s</Text> ·
                                    End: <Text style={{ fontWeight: "900", color: "green" }}>{rep.tEnd.toFixed(2)}s</Text>
                                </Text>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
}