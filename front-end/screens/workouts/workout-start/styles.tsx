import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#fff"
    },
    root: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 15
    },
    topContainer: {
        marginBottom: 10,
        gap: 10
    },
    title: {
        textAlign: "center",
        fontSize: 36,
        color: "green",
        fontWeight: "bold"
    },
    subtitle: {
        textAlign: "center",
        fontSize: 16,
        color: "green",
        fontWeight: "700",
        textTransform: "uppercase"
    },
    duration: {
        textAlign: "center",
        fontSize: 16,
        color: "gray",
        fontWeight: "bold",
        textTransform: "none"
    },
    bottom: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 16,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#E6E6E6",
        backgroundColor: "white"
    },
})