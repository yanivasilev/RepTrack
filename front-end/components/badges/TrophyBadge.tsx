import React, { useId } from "react";
import Svg, { Circle, Defs, G, LinearGradient, Path, RadialGradient, Stop, Text } from "react-native-svg";

type TrophyBadgeProps = {
    label: string;
    size?: number;
};

export default function TrophyBadge({ label, size = 60 }: TrophyBadgeProps) {
    const uid = useId().replace(/:/g, "");
    const bgId = `bgGrad_${uid}`;
    const cupId = `cupGrad_${uid}`;

    const ribbonText = label.toUpperCase();

    return (
        <Svg viewBox="0 0 256 256" width={size} height={size} role="img">
            <Defs>
                <RadialGradient id={bgId} cx="30%" cy="25%" r="80%">
                    <Stop offset="0%" stopColor="#FFE8A3" />
                    <Stop offset="55%" stopColor="#F7C84B" />
                    <Stop offset="100%" stopColor="#D18A10" />
                </RadialGradient>

                <LinearGradient id={cupId} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#FFF2C6" />
                    <Stop offset="45%" stopColor="#F6C54A" />
                    <Stop offset="100%" stopColor="#B87407" />
                </LinearGradient>
            </Defs>

            {/* OUTER CIRCLE */}
            <Circle cx="128" cy="128" r="116" fill={`url(#${bgId})`} />
            <Circle cx="128" cy="128" r="116" fill="none" stroke="#8B5E00" strokeOpacity="0.35" strokeWidth="8" />
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

            {/* SHINE */}
            <Path
                d="M54 96c18-34 52-56 92-56 18 0 35 4 50 12-22-26-55-42-92-42-48 0-89 28-106 69 16-2 38 5 56 17z"
                fill="#fff"
                opacity="0.18"
            />

            {/* TROPHY */}
            <G>
                <Path
                    d="M78 88c-14 0-26 12-26 26 0 18 14 32 32 32h6v-18h-6c-8 0-14-6-14-14 0-4 3-8 8-8h12V88H78z"
                    fill={`url(#${cupId})`}
                    opacity="0.95"
                />
                <Path
                    d="M178 88c14 0 26 12 26 26 0 18-14 32-32 32h-6v-18h6c8 0 14-6 14-14 0-4 3-8-8-8h-12V88h12z"
                    fill={`url(#${cupId})`}
                    opacity="0.95"
                />

                <Path
                    d="M92 74h72v46c0 26-18 46-36 52-18-6-36-26-36-52V74z"
                    fill={`url(#${cupId})`}
                />
                <Path
                    d="M88 74h80c4 0 8 4 8 8v6H80v-6c0-4 4-8 8-8z"
                    fill="#FFF2C6"
                    opacity="0.85"
                />

                <Path
                    d="M116 170h24c0 14 6 20 16 24v10H100v-10c10-4 16-10 16-24z"
                    fill={`url(#${cupId})`}
                />

                <Path
                    d="M88 204h80c6 0 10 4 10 10v12H78v-12c0-6 4-10 10-10z"
                    fill="#B87407"
                />
                <Path
                    d="M88 204h80c6 0 10 4 10 10v3H78v-3c0-6 4-10 10-10z"
                    fill="#F6C54A"
                    opacity="0.65"
                />

                <Path d="M110 92c0 26 0 52 18 72-22-12-26-40-26-72h8z" fill="#fff" opacity="0.18" />
            </G>

            {/* RIBBON */}
            <G>
                <Path
                    d="M64 176h128c6 0 10 4 10 10v18c0 6-4 10-10 10H64c-6 0-10-4-10-10v-18c0-6 4-10 10-10z"
                    fill="#B87407"
                />
                <Path
                    d="M64 176h128c6 0 10 4 10 10v4H54v-4c0-6 4-10 10-10z"
                    fill="#F6C54A"
                    opacity="0.65"
                />
                <Path d="M64 214l18-14v26l-18-12z" fill="#9E6506" opacity="0.95" />
                <Path d="M192 214l-18-14v26l18-12z" fill="#9E6506" opacity="0.95" />

                <Text
                    x="128"
                    y="202"
                    textAnchor="middle"
                    fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
                    fontSize="40"
                    fontWeight="800"
                    fill="#ffffff"
                    letterSpacing="0.5"
                >
                    {ribbonText}
                </Text>
            </G>

            {/* INNER CIRCLE */}
            <Circle cx="128" cy="128" r="110" fill="none" stroke="#fff" strokeOpacity="0.10" strokeWidth="4" />
        </Svg>
    );
}
