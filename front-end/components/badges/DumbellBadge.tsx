import React, { useId } from "react";
import Svg, { Circle, Defs, G, LinearGradient, Path, RadialGradient, Rect, Stop, Text } from "react-native-svg";

type DumbellBadgeProps = {
    label: string;
    size?: number;
};

export default function DumbellBadge({ label, size = 60 }: DumbellBadgeProps) {
    const uid = useId().replace(/:/g, "");

    const bgId = `bgGrad_gray_${uid}`;
    const metalId = `metalGrad_gray_${uid}`;
    const darkMetalId = `darkMetalGrad_gray_${uid}`;

    const ribbonText = label.toUpperCase();

    return (
        <Svg viewBox="0 0 256 256" width={size} height={size} role="img">
            <Defs>
                <RadialGradient id={bgId} cx="30%" cy="25%" r="80%">
                    <Stop offset="0%" stopColor="#F2F4F7" />
                    <Stop offset="55%" stopColor="#B8C0CC" />
                    <Stop offset="100%" stopColor="#5B6472" />
                </RadialGradient>

                <LinearGradient id={metalId} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                    <Stop offset="45%" stopColor="#C9D1DB" />
                    <Stop offset="100%" stopColor="#707A89" />
                </LinearGradient>

                <LinearGradient id={darkMetalId} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#D7DEE7" />
                    <Stop offset="55%" stopColor="#8B95A6" />
                    <Stop offset="100%" stopColor="#4B5462" />
                </LinearGradient>
            </Defs>

            <Circle cx="128" cy="128" r="116" fill={`url(#${bgId})`} />
            <Circle
                cx="128"
                cy="128"
                r="116"
                fill="none"
                stroke="#2F3742"
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
                opacity="0.16"
            />

            <G>
                <Rect x="54" y="108" width="18" height="40" rx="6" fill={`url(#${darkMetalId})`} />
                <Rect x="74" y="104" width="22" height="48" rx="7" fill={`url(#${metalId})`} />
                <Rect x="98" y="110" width="14" height="36" rx="6" fill={`url(#${darkMetalId})`} />

                <Rect x="112" y="120" width="32" height="16" rx="8" fill={`url(#${metalId})`} />
                <Rect x="118" y="124" width="20" height="8" rx="4" fill="#FFFFFF" opacity="0.25" />

                <Rect x="144" y="110" width="14" height="36" rx="6" fill={`url(#${darkMetalId})`} />
                <Rect x="160" y="104" width="22" height="48" rx="7" fill={`url(#${metalId})`} />
                <Rect x="184" y="108" width="18" height="40" rx="6" fill={`url(#${darkMetalId})`} />

                <Path
                    d="M76 110c0 14 0 26 10 36-14-6-16-18-16-36h6z"
                    fill="#fff"
                    opacity="0.12"
                />
            </G>

            <G>
                <Path
                    d="M64 176h128c6 0 10 4 10 10v18c0 6-4 10-10 10H64c-6 0-10-4-10-10v-18c0-6 4-10 10-10z"
                    fill="#4B5462"
                />
                <Path
                    d="M64 176h128c6 0 10 4 10 10v4H54v-4c0-6 4-10 10-10z"
                    fill="#AAB2BE"
                    opacity="0.65"
                />
                <Path d="M64 214l18-14v26l-18-12z" fill="#2F3742" />
                <Path d="M192 214l-18-14v26l18-12z" fill="#2F3742" />

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

            <Circle
                cx="128"
                cy="128"
                r="110"
                fill="none"
                stroke="#fff"
                strokeOpacity="0.10"
                strokeWidth="4"
            />
        </Svg>
    );
}
