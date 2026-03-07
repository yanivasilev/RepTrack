import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card: {
        padding: 12,
        borderRadius: 14,
        backgroundColor: "#F6F6F6",
        flexDirection: "column",
        gap: 10,
        marginBottom: 10,

        // IOS SHADOW
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 8,

        // ANDROID SHADOW
        elevation: 6,
    },
    cardTop: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    setIndexText: {
        fontWeight: "800",
        width: 80,
        color: "green"
    },
    setContent: {
        flexDirection: "row",
        gap: 10
    },
    cardButtons: {
        flexDirection: "row",
        gap: 5
    }
});
