import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    root: {
        width: "100%",
        flex: 1,
    },
    filtersWrap: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 10,
    },
    filtersContainer: {
        flexDirection: "row",
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "green",
        gap: 6,
    },
    filterButton: {
        flex: 1,
        borderRadius: 999,
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    filterButtonActive: {
        backgroundColor: "green",
    },
    filterText: {
        color: "green",
        fontWeight: "800",
    },
    filterTextActive: {
        color: "white",
    },
    listContainer: {
        gap: 10,
        paddingBottom: 24,
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
    errorContainer: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        alignItems: "center",
        gap: 10,
    },
    errorText: {
        color: "red",
        textAlign: "center",
    },
    retryButton: {
        borderWidth: 1,
        borderColor: "green",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: "white",
    },
    retryText: {
        color: "green",
        fontWeight: "700",
    },
});
