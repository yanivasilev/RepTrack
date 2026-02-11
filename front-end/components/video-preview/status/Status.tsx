import React from "react";
import { View, Text } from "react-native";
import { VideoPreviewCodeStyles } from "../../../libs/helpers/VideoPreviewCodeStyles";

type StatusProps = {
    code: string;
    message: string
}

export function Status({ code, message }: StatusProps) {
    const codeStyles = VideoPreviewCodeStyles(code);

    return (
        <View style={{ gap: 8 }}>
            <View
                style={{
                    alignSelf: "flex-start",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: codeStyles.bg,
                    borderWidth: 1,
                    borderColor: codeStyles.border,
                }}
            >
                <Text style={{ color: codeStyles.fg, fontWeight: "900", fontSize: 12 }}>
                    {code.replace(/_/g, " ")}
                </Text>
            </View>

            <Text style={{ fontSize: 18, fontWeight: "900", color: codeStyles.fg }}>
                {message}
            </Text>
        </View>

    );
}