import { Text, Pressable, StyleSheet, View } from "react-native";
import { ChatBubbleOvalLeftIcon } from "react-native-heroicons/outline";

type replyButtonProps = {
    replyCount: number;
};

export default function ReplyButton({ replyCount }: replyButtonProps) {
    return (
        <Pressable style={{ paddingVertical: 6, paddingHorizontal: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <ChatBubbleOvalLeftIcon color="gray" />
                <Text style={{ color: "gray", minWidth: 24 }}>{replyCount}</Text>
            </View>
        </Pressable>
    );
}