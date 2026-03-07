import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#fff"
    },
    root: {
        flex: 1,
        backgroundColor: "#fff"
    },
    container: {
        marginTop: 35,
        gap: 10
    },
    repliesTitle: {
        paddingHorizontal: 16,
        paddingBottom: 10,
        color: "green",
        fontWeight: "bold",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "gray"
    },
    emptyContainer: {
        paddingHorizontal: 16,
    },
    emptyText: {
        color: "gray"
    }
});
