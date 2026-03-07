import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "gray"
    },
    cardPressed: {
        opacity: 0.85
    },
    username: {
        fontSize: 15,
        fontWeight: "700",
        color: "green"
    }
});
