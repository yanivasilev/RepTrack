import { Pressable, Text } from "react-native";

type UploadVideoButtonProps = {
    isDisabled: boolean;
    onPress: () => void;
};

export default function UploadVideoButton({ isDisabled, onPress }: UploadVideoButtonProps) {
    return (
        <Pressable
            disabled={isDisabled}
            onPress={onPress}
            style={({ pressed }) => ({
                paddingVertical: 14,
                borderRadius: 14,
                alignItems: "center",
                backgroundColor: isDisabled
                    ? "#CFCFCF"
                    : pressed
                        ? "#dfdfdf"
                        : "#F6F6F6",
                opacity: isDisabled ? 0.6 : 1,
                borderWidth: isDisabled ? undefined : 1,
                borderColor: isDisabled ? undefined : "green",
            })}
        >
            <Text
                style={{
                    color: isDisabled ? "#888" : "green",
                    fontWeight: "900",
                }}
            >
                UPLOAD VIDEO
            </Text>
        </Pressable>
    );
}
