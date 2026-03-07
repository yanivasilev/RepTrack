import React, { useId } from "react";
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, RadialGradient, Rect, Stop, Text } from "react-native-svg";

type ClockBadgeProps = {
    label: string;
    size?: number;
};

export default function ClockBadge({ label, size = 60 }: ClockBadgeProps) {
    const uid = useId().replace(/:/g, "");
    const bgId = `bgGrad_${uid}`;
    const metalId = `metalGrad_${uid}`;
    const faceId = `faceGrad_${uid}`;

    const ribbonText = label.toUpperCase();

    return (
        <Svg viewBox="0 0 256 256" width={size} height={size} role="img">
            <Defs>
                <RadialGradient id={bgId} cx="30%" cy="25%" r="80%">
                    <Stop offset="0%" stopColor="#BFE9FF" />
                    <Stop offset="55%" stopColor="#4CB3FF" />
                    <Stop offset="100%" stopColor="#0D5EA6" />
                </RadialGradient>

                <LinearGradient id={metalId} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#E3F6FF" />
                    <Stop offset="45%" stopColor="#5BC0FF" />
                    <Stop offset="100%" stopColor="#0A4C85" />
                </LinearGradient>

                <LinearGradient id={faceId} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                    <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.7" />
                </LinearGradient>
            </Defs>

            <Circle cx="128" cy="128" r="116" fill={`url(#${bgId})`} />
            <Circle
                cx="128"
                cy="128"
                r="116"
                fill="none"
                stroke="#083B66"
                strokeOpacity="0.35"
                strokeWidth="8"
            />
            <Circle
                cx="128"
                cy="128"
                r="96"
                fill="#ffffff"
                fillOpacity="0.10"
                stroke="#ffffff"
                strokeOpacity="0.18"
                strokeWidth="2"
            />

            <Path
                d="M54 96c18-34 52-56 92-56 18 0 35 4 50 12-22-26-55-42-92-42-48 0-89 28-106 69 16-2 38 5 56 17z"
                fill="#fff"
                opacity="0.18"
            />

            <G>
                <Rect x="114" y="52" width="28" height="16" rx="6" fill={`url(#${metalId})`} />
                <Rect x="104" y="64" width="48" height="18" rx="9" fill={`url(#${metalId})`} />

                <Circle cx="128" cy="128" r="62" fill={`url(#${metalId})`} />
                <Circle cx="128" cy="128" r="50" fill={`url(#${faceId})`} />

                <G stroke="#0A4C85" strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round">
                    <Line x1="128" y1="82" x2="128" y2="90" />
                    <Line x1="128" y1="166" x2="128" y2="174" />
                    <Line x1="82" y1="128" x2="90" y2="128" />
                    <Line x1="166" y1="128" x2="174" y2="128" />
                    <Line x1="96" y1="96" x2="102" y2="102" />
                    <Line x1="160" y1="160" x2="154" y2="154" />
                    <Line x1="160" y1="96" x2="154" y2="102" />
                    <Line x1="96" y1="160" x2="102" y2="154" />
                </G>

                <G stroke="#083B66" strokeWidth="6" strokeLinecap="round">
                    <Line x1="128" y1="128" x2="128" y2="104" />
                    <Line x1="128" y1="128" x2="148" y2="138" />
                </G>
                <Circle cx="128" cy="128" r="6" fill="#083B66" />

                <Path d="M106 104c0 22 0 44 16 60-20-10-22-34-22-60h6z" fill="#fff" opacity="0.16" />
            </G>

            <G>
                <Path
                    d="M64 176h128c6 0 10 4 10 10v18c0 6-4 10-10 10H64c-6 0-10-4-10-10v-18c0-6 4-10 10-10z"
                    fill="#0A4C85"
                />
                <Path
                    d="M64 176h128c6 0 10 4 10 10v4H54v-4c0-6 4-10 10-10z"
                    fill="#5BC0FF"
                    opacity="0.65"
                />
                <Path d="M64 214l18-14v26l-18-12z" fill="#06345C" />
                <Path d="M192 214l-18-14v26l18-12z" fill="#06345C" />

                <Text
                    x="128"
                    y="202"
                    textAnchor="middle"
                    fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
                    fontSize="40"
                    fontWeight="800"
                    fill="#ffffff"
                    letterSpacing="1"
                >
                    {ribbonText}
                </Text>
            </G>

            <Circle cx="128" cy="128" r="110" fill="none" stroke="#fff" strokeOpacity="0.10" strokeWidth="4" />
        </Svg>
    );
}
