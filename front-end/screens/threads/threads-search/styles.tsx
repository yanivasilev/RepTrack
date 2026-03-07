import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#fff",
    },
    root: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        paddingHorizontal: 16,
        gap: 10,
        paddingBottom: 10,
    },
    title: {
        textAlign: "center",
        fontSize: 36,
        color: "green",
        fontWeight: "bold",
    },
    listContainer: {
        paddingHorizontal: 16,
        gap: 10,
        paddingBottom: 16,
    },
    headerLoader: {
        paddingVertical: 12,
        alignItems: "center",
    },
    footerLoader: {
        paddingVertical: 16,
        alignItems: "center",
        gap: 8,
    },
    emptyContainer: {
        paddingVertical: 24,
        alignItems: "center",
    },
    emptyText: {
        color: "#666",
    },
    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderWidth: 1,
        borderColor: "#DCECDC",
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: "#fff",
    },
    profileCardPressed: {
        backgroundColor: "#F3FBF3",
        borderColor: "#BDE3BD",
    },
    profileUsername: {
        color: "green",
        fontSize: 16,
        fontWeight: "700",
    },
});
