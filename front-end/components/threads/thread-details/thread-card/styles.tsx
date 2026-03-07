import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: "row",
        gap: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "gray"
    },
    mainCol: {
        flex: 1
    },
    headerLine: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        justifyContent: "space-between"
    },
    headerLineContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    actionsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    username: {
        fontSize: 15,
        fontWeight: "700",
        color: "green"
    },
    time: {
        fontSize: 13,
        color: "gray"
    },
    threadTitle: {
        marginTop: 5,
        fontSize: 15,
        lineHeight: 20,
        fontWeight: "bold",
        color: "gray"
    },
    threadBody: {
        fontSize: 15,
        lineHeight: 20,
        color: "gray"
    },
    buttonsRow: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    }
});
