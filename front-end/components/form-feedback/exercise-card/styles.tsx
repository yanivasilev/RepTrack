import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    cardBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 12,
        borderRadius: 16
    },
    cardIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
    },
    cardName: {
        fontSize: 15,
        fontWeight: "900"
    },
    levelBox: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999
    },
    levelText: {
        color: "white",
        fontWeight: "600",
        textTransform: 'uppercase',
        fontSize: 12
    }
})