import React, { useId } from "react";
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Stop, Text } from "react-native-svg";

type FireBadgeProps = {
    label: string;
    size?: number;
};

export default function FireBadge({ label, size = 60 }: FireBadgeProps) {
    const uid = useId().replace(/:/g, "");
    const bgId = `bgGrad_fire_${uid}`;
    const flameId = `flameGrad_fire_${uid}`;

    const ribbonText = label.toUpperCase();

    return (
        <Svg viewBox="0 0 256 256" width={size} height={size} role="img">
            <Defs>
                <RadialGradient id={bgId} cx="30%" cy="25%" r="80%">
                    <Stop offset="0%" stopColor="#FFD0D0" />
                    <Stop offset="55%" stopColor="#FF4B4B" />
                    <Stop offset="100%" stopColor="#8C0E0E" />
                </RadialGradient>

                <LinearGradient id={flameId} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#FFF1B8" />
                    <Stop offset="35%" stopColor="#FFB020" />
                    <Stop offset="70%" stopColor="#FF3A2E" />
                    <Stop offset="100%" stopColor="#8C0E0E" />
                </LinearGradient>
            </Defs>

            <Circle cx="128" cy="128" r="116" fill={`url(#${bgId})`} />
            <Circle
                cx="128"
                cy="128"
                r="116"
                fill="none"
                stroke="#5A0A0A"
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
                <Path
                    d="M128 70
             C110 92 118 105 104 120
             C92 133 88 151 96 167
             C106 187 124 196 128 196
             C132 196 150 187 160 167
             C168 151 164 133 152 120
             C139 106 146 92 128 70Z"
                    fill={`url(#${flameId})`}
                />

                <Path
                    d="M128 108
             C120 121 122 130 114 140
             C108 148 106 158 110 167
             C116 180 126 186 128 186
             C130 186 140 180 146 167
             C150 158 148 148 142 140
             C134 131 136 121 128 108Z"
                    fill="#FFF1B8"
                    opacity="0.92"
                />

                <Path
                    d="M116 132c0 18 6 34 18 46-18-6-24-22-24-46h6z"
                    fill="#fff"
                    opacity="0.16"
                />

                <Circle cx="92" cy="124" r="3" fill="#FFF1B8" opacity="0.75" />
                <Circle cx="170" cy="120" r="2.5" fill="#FFF1B8" opacity="0.65" />
                <Circle cx="160" cy="92" r="3" fill="#FFF1B8" opacity="0.55" />
                <Circle cx="102" cy="94" r="2.5" fill="#FFF1B8" opacity="0.55" />

                <Ellipse cx="128" cy="196" rx="44" ry="10" fill="#2A0404" opacity="0.22" />
            </G>

            <G>
                <Path
                    d="M64 176h128c6 0 10 4 10 10v18c0 6-4 10-10 10H64c-6 0-10-4-10-10v-18c0-6 4-10 10-10z"
                    fill="#B11212"
                />
                <Path
                    d="M64 176h128c6 0 10 4 10 10v4H54v-4c0-6 4-10 10-10z"
                    fill="#FF6B6B"
                    opacity="0.65"
                />
                <Path d="M64 214l18-14v26l-18-12z" fill="#7A0D0D" />
                <Path d="M192 214l-18-14v26l18-12z" fill="#7A0D0D" />

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
