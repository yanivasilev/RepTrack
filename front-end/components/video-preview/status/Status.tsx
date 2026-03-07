import React from "react";
import { View, Text } from "react-native";
import { VideoPreviewCodeStyles } from "../../../libs/helpers/VideoPreviewCodeStyles";
import { styles } from "./styles";

type StatusProps = {
    code: string;
    message?: string
}

export function Status({ code, message }: StatusProps) {
    const codeStyles = VideoPreviewCodeStyles(code);

    return (
        <View>
            <View style={[styles.card, { backgroundColor: codeStyles.bg, borderColor: codeStyles.border }]}>
                <Text style={[styles.code, { color: codeStyles.fg }]}>
                    {code.replace(/_/g, " ")}
                </Text>
            </View>

            {message && (
                <Text style={[styles.message, { color: codeStyles.fg }]}>
                    {message}
                </Text>
            )}
        </View>
    );
}