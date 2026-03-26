import React, { useMemo } from "react";
import { View } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import { PoseFrameType } from "../../libs/types/exercise-analysis/PoseFrameType";
import { getKeypointsByName } from "../../libs/helpers/video-preview/getKeypointsByName";
import { mapNormalizedPointToBox } from "../../libs/helpers/video-preview/mapNormalisedPointToBox";
import { DrawBox } from "../../libs/types/video-preview/DrawBox";

type KeypointsOverlayProps = {
    frame: PoseFrameType | null;
    drawBox: DrawBox | null;
    showKeypoints: boolean;
    minScore?: number;
};

const SKELETON_EDGES: Array<[string, string]> = [
    ["left_shoulder", "right_shoulder"],
    ["left_hip", "right_hip"],
    ["left_shoulder", "left_elbow"],
    ["left_elbow", "left_wrist"],
    ["right_shoulder", "right_elbow"],
    ["right_elbow", "right_wrist"],
    ["left_shoulder", "left_hip"],
    ["right_shoulder", "right_hip"],
    ["left_hip", "left_knee"],
    ["left_knee", "left_ankle"],
    ["right_hip", "right_knee"],
    ["right_knee", "right_ankle"],
];

export default function KeypointsOverlay({ frame, drawBox, showKeypoints, minScore = 0.35 }: KeypointsOverlayProps) {
    const keypointsByName = useMemo(() => {
        if (!frame || !drawBox) return null;
        return getKeypointsByName(frame.keypoints, drawBox);
    }, [drawBox, frame]);

    if (!showKeypoints || !drawBox || !frame) return null;

    return (
        <View pointerEvents="none" style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}>
            <Svg width="100%" height="100%">
                {keypointsByName &&
                    SKELETON_EDGES.map(([start, end]) => {
                        const p1 = keypointsByName.get(start);
                        const p2 = keypointsByName.get(end);
                        if (!p1 || !p2) return null;
                        if (p1.score < minScore || p2.score < minScore) return null;

                        return (
                            <Line
                                key={`${start}-${end}`}
                                x1={p1.x}
                                y1={p1.y}
                                x2={p2.x}
                                y2={p2.y}
                                stroke="blue"
                                strokeWidth={2}
                                strokeOpacity={0.9}
                            />
                        );
                    })}

                {frame.keypoints
                    .filter((kp) => kp.score >= minScore)
                    .map((kp) => {
                        const point = mapNormalizedPointToBox(kp.x, kp.y, drawBox);
                        return (
                            <Circle
                                key={kp.name}
                                cx={point.x}
                                cy={point.y}
                                r={4}
                                fill="white"
                                stroke="blue"
                                strokeWidth={1}
                            />
                        );
                    })}
            </Svg>
        </View>
    );
}
