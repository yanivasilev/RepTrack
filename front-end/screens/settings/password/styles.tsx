import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#fff"
    },
    root: {
        flex: 1,
        backgroundColor: "#fff"
    },
    title: {
        textAlign: "center",
        fontSize: 36,
        color: "green",
        fontWeight: "bold"
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        justifyContent: "space-between",
    },
    overlay: {
        position: "absolute" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100
    },
    box: {
        width: "90%",
        backgroundColor: "white",
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: "center"
    },
    text: {
        color: "white",
        fontSize: 16,
        textAlign: "center"
    },
    closeButton: {
        marginTop: 16,
        paddingVertical: 10,
        paddingHorizontal: 24,
        backgroundColor: "gray",
        borderRadius: 12
    },
    closeButtonPressed: {
        backgroundColor: "darkgray",
    },
    closeText: {
        color: "white",
        fontWeight: "bold"
    },
    loading: {
        flex: 1,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        justifyContent: "center",
        alignItems: "center",
    }
})