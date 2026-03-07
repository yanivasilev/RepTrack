import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 12,
        borderRadius: 16,
        backgroundColor: "#F6F6F6"
    },
    cardPressed: {
        backgroundColor: "#dfdfdf"
    },
    content: {
        flex: 1,
        gap: 2
    },
    date: {
        fontSize: 15,
        fontWeight: "900",
        color: "green"
    },
    datePressed: {
        color: "darkgreen"
    },
    statText: {
        color: "#888",
        fontSize: 12
    },
    statLabel: {
        fontWeight: "bold"
    },
    notesLabel: {
        fontSize: 15,
        fontWeight: "900",
        color: "green",
        marginTop: 10
    },
    notesText: {
        fontStyle: "italic",
        color: "#888",
        fontSize: 12
    },
    hintContainer: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        backgroundColor: "green",
        padding: 3,
        gap: 5
    },
    hintContainerPressed: {
        backgroundColor: "darkgreen"
    },
    hint: {
        color: "white",
        fontWeight: "700",
        fontSize: 16
    },
    hintPressed: {
        color: "#dfdfdf"
    }
})