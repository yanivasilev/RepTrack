import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === "ios" ? 12 : 10,
        borderRadius: 14,
        backgroundColor: "#F2F2F2",
        borderColor: "green",
        borderWidth: 1,
        height: 60
    },
    searchInput: {
        flex: 1,
        fontSize: 16
    },
    searchClearButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: "#E6E6E6",
    },
    searchClearText: {
        color: "#333"
    }
})